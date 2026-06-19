const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors'); // បន្ថែម cors នៅទីនេះ
const app = express();

// អនុញ្ញាតឲ្យ Frontend ពី Port ផ្សេងអាចហៅ API នេះបាន
app.use(cors()); 
app.use(express.json());

// ភ្ជាប់ទៅកាន់ MQTT Broker
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com'); 

mqttClient.on('connect', () => {
    console.log('Backend connected to MQTT Broker');
});

// API Webhook សម្រាប់ទទួលព័ត៌មានពីធនាគារ
app.post('/api/payment-webhook', (req, res) => {
    const paymentStatus = req.body.status; 
    const machineId = req.body.machine_id; 
    const rowToDrop = req.body.row;        

    if (paymentStatus === 'SUCCESS') {
        const topic = `vending/${machineId}/command`;
        
        // បោះសារទៅកាន់ម៉ាស៊ីន
        mqttClient.publish(topic, rowToDrop);
        console.log(`Payment successful. Command sent to ${topic}: ${rowToDrop}`);
        
        res.status(200).json({ message: "Payment verified, drink dispensed." });
    } else {
        res.status(400).json({ message: "Payment failed." });
    }
});

app.listen(3000, () => {
    console.log('Backend Server is running on port 3000');
});