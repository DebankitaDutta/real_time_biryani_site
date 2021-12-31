import axios from 'axios';
import toastr from 'toastr';
import moment from 'moment';
import {initAdmin} from './admin';

const addToCart=document.querySelectorAll('.add-to-cart');
const cartCounter=document.querySelector('#cartCounter');
addToCart.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
    let biryani=JSON.parse(btn.dataset.biryani);
    updateCart(biryani);
})
})

function updateCart(biryani)
{
    axios.post('/update-cart',biryani).then(res=>{
        console.log(res);
        cartCounter.innerText=res.data.totalQty;
        toastr.options = {
            newestOnTop      : true,
            closeButton      : false,
            progressBar      : false,
            preventDuplicates: false,
            "hideMethod": "hide",
            timeOut          : 1000, //default timeout,
        };
        toastr.success('added to the cart');

    }).catch(err=>{
        toastr.options = {
            newestOnTop      : true,
            closeButton      : false,
            progressBar      : false,
            preventDuplicates: false,
            "hideMethod": "hide",
            timeOut          : 1000, //default timeout,
        };
        toastr.error('sorry!error occured');
    })
}

//vanishing the order placed successfully div after 2 secs inside customer/orders

var alertMsg=document.querySelector('#success-alert');
if(alertMsg){
    setTimeout(() => {
        // console.log('inside alert-msg')
        alertMsg.remove();
    }, 2000);
}



//showing status
let input=document.querySelector('#hiddenInput');
let order=input?JSON.parse(input.value):null;
let statuses=document.querySelectorAll('.status_line');
// let time=;
let time=document.createElement('small');


function updateStatus(order){
    statuses.forEach(status=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })
    let stepCompleted=true;
    statuses.forEach(status=>{
        let dataProp=status.dataset.status;
        if(stepCompleted){
            status.classList.add('step-completed');
            status.appendChild(time);
        }
        if(order.orderStatus===dataProp){
            stepCompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm A');
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}
updateStatus(order)

//socket client side 

let socket=io();
if(order){
    
    socket.emit('join',`order_${order._id}`);
}

//admin join
const adminAreaPath=window.location.pathname;
if(adminAreaPath.includes('admin')){
    initAdmin(socket)

    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',data=>{
    const updatedOrder={...order};
    updatedOrder.updatedAt=moment().format();
    updatedOrder.orderStatus=data.orderStatus
    updateStatus(updatedOrder);
    toastr.options = {
        newestOnTop      : true,
        closeButton      : false,
        progressBar      : false,
        preventDuplicates: false,
        "hideMethod": "hide",
        timeOut          : 1000, //default timeout,
    };
    toastr.success('order updated');
    // console.log(data);
})














