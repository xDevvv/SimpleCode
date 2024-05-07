// Example Data from User

const input1 = document.getElementById('network-id');
const input2 = document.getElementById('class');
const input3 = document.getElementById('default-subnet-mask');
const input4 = document.getElementById('new-subnet-mask');
const input5 = document.getElementById('ip-address-range');
const input6 = document.getElementById('increment');
const input7 = document.getElementById('broadcast-address');

const table = document.querySelector('.main-table'); 

const btnDisplay = document.querySelector('.btn');




// Main Function Button
btnDisplay.addEventListener('click', () => {

    
    const dataStorage = [];

    let data = {
        networkId: input1.value,
        class: input2.value,
        defaultSubnetMask: input3.value,
        newSubnetMask: input4.value,
        ipAddressRange: input5.value,
        increment: input6.value,
        broadcastAddress: input7.value
    }

    dataStorage.push(data);
    
    // Inserting Each Value to the Table
    dataStorage.forEach((value) => {
        table.insertAdjacentHTML('beforeend',
        `
            <tr>
                <td>${value.networkId}</td>
                <td>${value.class}</td>
                <td>${value.defaultSubnetMask}</td>
                <td>${value.newSubnetMask}</td>
                <td>${value.ipAddressRange}</td>
                <td>${value.increment}</td>
                <td>${value.broadcastAddress}</td>
            </tr>
        ` 
    )
    })
    // Reset the Inputs
    input1.value = '';
    input2.value = '';
    input3.value = '';
    input4.value = '';
    input5.value = '';
    input6.value = '';
    input7.value = '';


    
})


