import axios from 'axios';

const API_KEY = 'sk-fNkKrK7RlC9bNlWD129d06F034Db4cB7B76fA8FfBbC916Da';
const API_BASE_URL = 'https://api.laozhang.ai';

const testApi = async () => {
    console.log('Testing API Connection...');

    try {
        // 1. 尝试列出模型
        console.log('\n1. Fetching models list...');
        const response = await axios.get(`${API_BASE_URL}/v1/models`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('✅ Models fetched successfully!');
        console.log('Available models:', response.data.data.map(m => m.id));

    } catch (error) {
        console.error('❌ Failed to fetch models:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }

    try {
        // 2. 尝试一个简单的生成请求 (使用默认模型或从上面获取的)
        console.log('\n2. Testing generation endpoint...');
        // 由于我们不确定模型，先用一个通用的名字或者留空看报错
        // 这里我们先跳过，看看能不能先拿到模型列表
    } catch (error) {
        console.error('❌ Generation test failed');
    }
};

testApi();
