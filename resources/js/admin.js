import axios from 'axios'
import moment from 'moment'
import toastr from 'toastr';
 
export function initAdmin(socket){
    // console.log('hey inside init admin')
    const orderTableBody=document.querySelector('#orderTableBody');
    let orders=[]
    let markup

    axios.get('/admin/orders',{
        headers:{
            "x-requested-with": 'XMLHttpRequest'
        }
    }).then(res=>{
        orders=res.data;
        markup=generateMarkup(orders);
        orderTableBody.innerHTML=markup;
    })
    .catch(err=>{
        console.log(err);
    })

    function renderItems(items){
        let parsedItems=Object.values(items);
        return parsedItems.map(menuItem=>{
            return `<p> ${ menuItem.item.name } - ${menuItem.qty} plates</p>`
        }).join('')
    }

    function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">

                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order placed"
                                ${ order.orderStatus === 'order placed' ? 'selected' : '' }>
                                Placed</option>
                            <option value="confirmed" ${ order.orderStatus === 'confirmed' ? 'selected' : '' }>
                                Confirmed</option>
                            <option value="prepared" ${ order.orderStatus === 'prepared' ? 'selected' : '' }>
                                Prepared</option>
                            <option value="delivered" ${ order.orderStatus === 'delivered' ? 'selected' : '' }>
                                Delivered
                            </option>
                            <option value="completed" ${ order.orderStatus === 'completed' ? 'selected' : '' }>
                                Completed
                            </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("hh:mm A")}
                </td>
                <td class="border px-4 py-2">

                </td>
            </tr>
        `
        }).join('')
    }
    socket.on('orderPlaced',order=>{
        toastr.options = {
            newestOnTop      : true,
            closeButton      : false,
            progressBar      : false,
            preventDuplicates: false,
            "hideMethod": "hide",
            timeOut          : 1000, //default timeout,
        };
        toastr.success('new order!!');

        orders.unshift(order);
        orderTableBody.innerHTML='';
        orderTableBody.innerHTML=generateMarkup(orders);
    })
}
