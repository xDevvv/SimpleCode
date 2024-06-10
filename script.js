const main = document.querySelector('.main-container')
const option = document.getElementById('input-option');
const ipDiv = document.querySelector('.sub');
const ipAddress = document.getElementById('ip-address');
const reqNumber = document.querySelector('.subnet-host-input');

const finalResult = document.querySelector('.main-table');
const error = document.querySelector('.error');


// Buttons
const optionBtn = document.querySelector('.option-btn');
const ipClassBtn = document.querySelector('.ip-class-btn');


let firstOctet;
let ipClass;
let defaultSM;
let newSubnetMask;
let defaultPrefix;
let newPrefix;
let requiredHost;
let increment;
let borrowedBits;
let borrowedBitsValue;
let subnetMaskNumber;

let numOfSubnet = 0;
let numOfHost = 0;
let networkAddress = 0;
let firstUsableHost = 0;
let lastUsableHost= 0;
let broadcastAddress = 0;


const ipSplitting = (ip) => {
    return ip.split(".");
}

const getIpClasses = (ip) => {

    let first_octet = ip;
    let rules = [
        {sClass: "A", range: [0, 126]},
        {sClass: "B", range: [128, 191]},
        {sClass: "C", range: [192, 233]}
    ];
    
    for(let rule of rules){
        if(first_octet[0] >= rule['range'][0] && first_octet[0] <= rule['range'][1]){
            return rule['sClass'];
        }
    }
}

const sumFinder = (subnet) => {
    let octet;
    if(subnet > 16) {
        octet = subnet - 16
    } else if(subnet > 8) { 
        octet = subnet - 8;
    } else {
        octet = subnet
    }
    
    if(octet == 0) return 255;
    let rules = [
        {number: 1, value: 128, },
        {number: 2, value: 192, },
        {number: 3, value: 224, },
        {number: 4, value: 240, },
        {number: 5, value: 248, },
        {number: 6, value: 252, },
        {number: 7, value: 254, },
        {number: 8, value: 255, },
    ]

    for(let rule of rules) {
        if(octet == rule['number']) {
            return rule['value'];
        }
    }
}

const incrementFinder = (inc) => {
    increment_list = [
        {number: 128, value: 128, },
        {number: 192, value: 64, },
        {number: 224, value: 32, },
        {number: 240, value: 16, },
        {number: 248, value: 8, },
        {number: 252, value: 4, },
        {number: 254, value: 2, },
        {number: 255, value: 256, },
    ]

    for(i of increment_list) {
        if(inc == i['number']) return increment = i['value'];
    }
}

const getDefaultSM = (ipClass) => {
    if(ipClass == 'A'){
        defaultPrefix = 8
        return '255.0.0.0'
    } else if (ipClass == 'B'){
        defaultPrefix = 16
        return '255.255.0.0'
    } else {
        defaultPrefix = 24
        return '255.255.255.0'
    }
}


const getBorrowedBits = (input) => {
    
    let inputCapacity = 0;
    let count = 0;
    while(inputCapacity < input) {  
        
        if(inputCapacity == 0){
            inputCapacity += 2
            
        }
        else {
            inputCapacity *= 2
        }
        count++;
    }
    
    return count;
}

const iterationToMainIp = (ip) => {
    let iteration = [];
    for(final of ip) {
        iteration.push(final);
    }
    return iteration;
}


const octetManipulator = (prefix, sub) => {
        let arr = [];
        if(prefix > 24) {
            arr = [255, 255, 255]; 
            arr.push(sub);
        } else if (prefix > 16) {
            arr = [255, 255];
            arr.push(sub);
        } else if(prefix >= 8) {
            arr = [255];
            arr.push(sub);
        }
        while(arr.length != 4) {
            arr.push(0);
        }
        
        return newSubnetMask = arr.join('.');
}

const getNetworkAdd = (network) => {
    let output;
    let mainIp;
    if(ipClass == 'C') {
        mainIp = ipSplitting(ipAddress.value).splice(0, 3)
        mainIp.push(network);
        output = iterationToMainIp(mainIp);
    }
    else if(ipClass == 'B') {
        if(newPrefix >= 24) {
            mainIp = ipSplitting(ipAddress.value).splice(0, 3)
            mainIp.push(network);
            output = iterationToMainIp(mainIp);
        }
        else {
            mainIp = ipSplitting(ipAddress.value).splice(0, 2)
            mainIp.push(network)
            output = iterationToMainIp(mainIp);
            while(output.length != 4) { output.push(0) }
        }
    }
    else if(ipClass == 'A') {
        if(newPrefix >= 24) {
            mainIp = ipSplitting(ipAddress.value).splice(0, 3);
            mainIp.push(network)
            output = iterationToMainIp(mainIp);
        }
        else if(newPrefix >= 16) {
            mainIp = ipSplitting(ipAddress.value).splice(0, 2);
        
            mainIp.push(network)
            output = iterationToMainIp(mainIp);
            while(output.length != 4) { output.push(0) }
        } else {
            mainIp = ipSplitting(ipAddress.value).splice(0, 1);
            mainIp.push(network)
            output = iterationToMainIp(mainIp);
            while(output.length != 4) { output.push(0) }
        }
    }
    return output.join('.');
}

const getUsableHost = (firstUsable, lastUsable) => {

    // UsableHost Container
    let firstUsableOutput;
    let lastUsableOutput;

    // Ip Container
    let first;
    let last;

    if(ipClass == 'C') {
        first = ipSplitting(ipAddress.value).splice(0, 3)
        first.push(firstUsable);

        last = ipSplitting(ipAddress.value).splice(0, 3)
        last.push(lastUsable);

        firstUsableOutput = iterationToMainIp(first);
        lastUsableOutput = iterationToMainIp(last);
    }
    else if (ipClass == 'B') {
        if(newPrefix >= 24) {
            first = ipSplitting(ipAddress.value).splice(0, 3)
            first.push(firstUsable);

            last = ipSplitting(ipAddress.value).splice(0, 3)
            last.push(lastUsable);

            firstUsableOutput = iterationToMainIp(first);
            lastUsableOutput = iterationToMainIp(last);
        } 
        else {
            first = ipSplitting(ipAddress.value).splice(0, 2);
        
            first.push(networkAddress);
            first.push(1);
            
            last = ipSplitting(ipAddress.value).splice(0, 2)
            
            last.push(lastUsable);
            last.push(254);

            firstUsableOutput = iterationToMainIp(first);
            lastUsableOutput = iterationToMainIp(last);
        }
    }
    else if(ipClass == 'A') {
        if(newPrefix >= 24) {
            first = ipSplitting(ipAddress.value).splice(0, 3);
            last = ipSplitting(ipAddress.value).splice(0, 3);

            first.push(firstUsable);
            last.push(lastUsable);

        } else if(newPrefix >= 16) {
            first = ipSplitting(ipAddress.value).splice(0, 2);
            last = ipSplitting(ipAddress.value).splice(0, 2);

            first.push(networkAddress);
            first.push(1);

            last.push(lastUsable);
            last.push(254);
        } else {
            first = ipSplitting(ipAddress.value).splice(0, 1);
            last = ipSplitting(ipAddress.value).splice(0, 1);

            first.push(networkAddress);
            first.push(0);
            first.push(1);

            last.push(lastUsable);
            last.push(255);
            last.push(254);
        }

            firstUsableOutput = iterationToMainIp(first);
            lastUsableOutput = iterationToMainIp(last);
    }
    return firstUsableOutput.join('.') + ' - ' + lastUsableOutput.join('.');
}

const getBroadcastAdd = (network) => {
    let mainIp;
    let brdCst;

    if(ipClass == 'C') {
        mainIp = ipSplitting(ipAddress.value).splice(0, 3)
        mainIp.push(network)
        
        brdCst = iterationToMainIp(mainIp);

    } else if(ipClass == 'B') {
        if(newPrefix >= 24) {
            let mainIp = ipSplitting(ipAddress.value).splice(0, 3)
            mainIp.push(network)
            
            brdCst = iterationToMainIp(mainIp);     
            
        } else {
            mainIp = ipSplitting(ipAddress.value).splice(0, 2)
            mainIp.push(network)
            brdCst = iterationToMainIp(mainIp);
            brdCst.push(255);
        }
        
    }
    else if(ipClass == 'A') {
        if(newPrefix >= 24) {
            mainIp = ipSplitting(ipAddress.value).splice(0, 3)
            mainIp.push(network);

            brdCst = iterationToMainIp(mainIp);
            
        } else if(newPrefix >= 16) {
            mainIp = ipSplitting(ipAddress.value).splice(0, 2)
            mainIp.push(network);

            brdCst = iterationToMainIp(mainIp);
            brdCst.push(255);
        } else {
            mainIp = ipSplitting(ipAddress.value).splice(0, 1)
            mainIp.push(network);

            brdCst = iterationToMainIp(mainIp);
            brdCst.push(255);
            brdCst.push(255);
        }
    }
    return brdCst.join('.')
}

const outputCalc = () => {
    if(newPrefix >= 24) {
        if(networkAddress == 0) {
            firstUsableHost = networkAddress + 1;
            lastUsableHost = increment - 2;
            broadcastAddress = increment - 1;
        }
    } else {
        if(networkAddress == 0) {
            firstUsableHost = networkAddress + 1;
            lastUsableHost = increment - 1;
            broadcastAddress = increment - 1;
        }
    }
}



const tableOuputs = () => {
    if(ipClass == 'C') {
        if(networkAddress == 0) {
            firstUsableHost = networkAddress + 1;
            lastUsableHost = increment - 2;
            broadcastAddress = increment - 1;
        }
    }
    else if(ipClass == 'B') {
        outputCalc();
    }
    else {
        outputCalc();
    }
    

    
    let numOfRow = 1;

    while(networkAddress != 256) {
        let network_address = getNetworkAdd(networkAddress);
        let usable_host = getUsableHost(firstUsableHost, lastUsableHost);
        let broadcast_address = getBroadcastAdd(broadcastAddress);



        finalResult.insertAdjacentHTML('beforeend', `
            <tr>
                <td class="row-num">
                    ${numOfRow}
                </td>
                <td>
                    ${network_address}
                </td>
                <td>
                    ${usable_host}
                </td>
                <td>
                    ${broadcast_address}
                </td>
            </tr>
        `);
            networkAddress += increment;
            firstUsableHost += increment;
            lastUsableHost += increment;
            broadcastAddress += increment;

            numOfRow += 1;
            if(option.value == 'host') numOfSubnet += 1;
    }
}









// Buttons

ipClassBtn.addEventListener('click', () => {

    firstOctet = ipSplitting(ipAddress.value);
    ipClass = getIpClasses(firstOctet);
    defaultSM = getDefaultSM(ipClass);
    ipDiv.innerHTML = `
        <table class="output-info">
            <tr>
                <td>IP Address Class</td>
                <td>${ipClass}</td>
            </tr>
        </table>
    `
});


optionBtn.addEventListener('click', () => {
            
            if(Number.isInteger(parseInt(reqNumber.value))  && option.value != 'default') {

                firstOctet = ipSplitting(ipAddress.value);
                ipClass = getIpClasses(firstOctet);
                defaultSM = getDefaultSM(ipClass);
    
                if(option.value == 'subnet') {
                    if(ipClass == 'A' && reqNumber.value > 4194304) return error.innerHTML = `<p>The maximum subnet can accommodate in Class A is  4194304 </p>`;
                    if(ipClass == 'B' && reqNumber.value > 16384) return error.innerHTML = `<p>The maximum subnet can accommodate in Class B is 16384.</p>`;
                    if(ipClass == 'C' && reqNumber.value > 64) return error.innerHTML = `<p>The maximum subnet can accommodate in Class C is 64.</p>`;
                    
                    
                    // Calculations
                    let subnetNeeded = reqNumber.value;
                    borrowedBits = getBorrowedBits(subnetNeeded);
                    numOfSubnet = 2 ** borrowedBits
                    newPrefix = defaultPrefix + borrowedBits;
                    borrowedBitsValue = sumFinder(borrowedBits)
                    octetManipulator(newPrefix, borrowedBitsValue);
                    numOfHost = 2 ** (32 - newPrefix);
                    incrementFinder(borrowedBitsValue);
                    tableOuputs();
                    
                    
                }
                else if (option.value == 'host') {
        
                    // Validations
                    if(ipClass == 'C' && (reqNumber.value <= 2 || reqNumber.value > 256 )) return error.innerHTML = `<p>The maximum host can accommodate in Class C is 256.</p>`;
                    if(ipClass == 'B' && (reqNumber.value <= 2 || reqNumber.value > 65534)) return error.innerHTML = `<p>The maximum host can accommodate in Class B is 65534.</p>`;
                    if(ipClass == 'A' && (reqNumber.value <= 2 || reqNumber.value > 16777214)) return error.innerHTML = `<p>The maximum host can accommodate in Class B is 16777214.</p>`;
        
                    // Calculations 
                    let hostNeeded = reqNumber.value;
                    borrowedBits = (32 - getBorrowedBits(hostNeeded) - defaultPrefix);
                    newPrefix = 32 - getBorrowedBits(hostNeeded);
                    borrowedBitsValue = sumFinder(borrowedBits);
                    numOfHost = 2 ** (32 - newPrefix);
                    octetManipulator(newPrefix, borrowedBitsValue);
                    incrementFinder(borrowedBitsValue);
                    tableOuputs();
                }
    
                // Rendering the Structure
                ipDiv.innerHTML = `
                    <table class="output-info">
                        <tr>
                            <td>IP Address Class</td>
                            <td>${ipClass}</td>
                        </tr>
                        <tr>
                            <td>Default Subnet Mask</td>  
                            <td>${defaultSM} / ${defaultPrefix}</td>                  
                        </tr>
                        <tr>
                            <td>IP Address </td>
                            <td>${ipAddress.value}</td>
                        </tr>    
                        <tr>
                            <td>No. of Subnets can Accommodate</td>
                            <td>${numOfSubnet}</td>
                        </tr>
                        <tr>
                            <td>No. of Host can Accommodate</td>
                            <td>${numOfHost}</td>
                        </tr>
                        <tr>
                            <td>Subnet Mask </td>
                            <td>${newSubnetMask} / ${newPrefix}</td>
                        </tr>
                        <tr>
                            <td>No. of Increment </td>
                            <td>${increment}<p/>
                        </tr>
                        <tr>
                            <td>No. of Borrowed Bits: </td>
                            <td>${borrowedBits}<p/>
                        </tr>
                        
                    </table>
                `;
            }
            else {
                return alert('Invalid Input')
            }
        
            ipAddress.value = '';
            reqNumber.value = '';
});



