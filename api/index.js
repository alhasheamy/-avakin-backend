const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// ��� ������� ����� ������ ������� �� ����� ������
let currentTask = {
    signal: false,
    task: null,
    player_id: null,
    timestamp: null
};

// 1. ���� ������ ���� �������� ��� ��������� ���� ���� �����
app.post('/set-command', (req, res) => {
    const { task, player_id } = req.body;

    // ���� ���� �� ��������
    if (!task || !player_id) {
        return res.status(400).json({ error: 'Missing task or player_id' });
    }

    // ����� ������ ������� ������ �������
    currentTask = {
        signal: true,
        task: task,
        player_id: player_id,
        timestamp: new Date().toISOString() // ��� ����� ������
    };
    
    console.log('New command set:', currentTask);
    res.status(200).json({ message: 'Command set successfully!', data: currentTask });

    // ����� ����� ������� �������� ��� 5 �����
    setTimeout(() => {
        currentTask.signal = false;
        console.log('Signal automatically turned off after 5 minutes.');
    }, 5 * 60 * 1000); // 5 �����
});

// 2. ���� ������ ���� ������ ����� ���� ���� (�� 30-60 �����)
app.get('/check-for-signal', (req, res) => {
    res.status(200).json({ signal: currentTask.signal });
});

// 3. ���� ������ ���� ���� ���� ����� ������ ������
app.get('/get-task', (req, res) => {
    // ���� ������ ��� ��� ���� ������� �����
    if (currentTask.signal) {
        res.status(200).json({ 
            task: currentTask.task, 
            player_id: currentTask.player_id,
            timestamp: currentTask.timestamp
        });
    } else {
        // ��� �� ��� ���� ����ɡ ���� ���� ������
        res.status(200).json({ task: null });
    }
});

// ���� ���� �������� ������ �� �� ������ ����
app.get('/', (req, res) => {
    res.send('Avakin Backend Server is running!');
});


// ����� ������� ����� ��� Vercel
module.exports = app;
