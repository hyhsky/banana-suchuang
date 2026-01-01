<?php
/**
 * API请求DEMO
 * 
 * 本demo支持常见的HTTP请求方法(GET/POST/PUT/DELETE等)
 */

 //基本配置
$api_key = 'tLdPCRBfuA4nK1Exu9h9lNh2a6';
$secret_key = '0f5cf5420c35431fc8291f9f82a8b3f4';

// API请求示例：
try {
    $client = new ApiClient($api_key, $secret_key);
    $client->setTimeout(10);
    $client->setVerifySSL(false); // 关闭SSL验证

    // GET请求示例
    echo "=== 开始GET请求 ===\n";
    $response = $client->get('https://api.wuyinkeji.com/api/img/nanoBanana-pro', [
        'key' => $api_key,
        'key2' => '其他参数'
    ]);
    print_r($response);
    //print_r($client->getLastRequestInfo());
    /* 
    // POST表单示例
    echo "\n=== 开始POST请求 ===\n";
    $response = $client->post('接口地址', [
        'key' => $api_key,
        'key2' => '其他参数'
    ]);
    print_r($response);
    print_r($client->getLastRequestInfo());

    // POST JSON示例
    echo "\n=== 开始POST JSON请求 ===\n";
    $response = $client->postJson('接口地址', [
        'key' => $api_key,
        'key2' => '其他参数'
    ]);
    print_r($response);
    print_r($client->getLastRequestInfo());
     */
} catch (ApiClientException $e) {
    echo "API请求错误: " . $e->getMessage();
    if ($e->getCode() > 0) {
        echo " (HTTP状态码: " . $e->getCode() . ")";
    }
    print_r($client->getLastRequestInfo() ?? []);
}

/**
 * API客户端类
 * 
 * 提供了一个简单的HTTP API客户端实现,支持常见的HTTP请求方法(GET/POST/PUT/DELETE等)
 * 具有以下主要功能:
 * - 支持 API 密钥和签名认证
 * - 可配置请求超时和SSL验证
 * - 支持自定义请求头
 * - 支持表单和JSON格式的请求体
 * - 自动解析响应结果
 * - 提供详细的请求信息记录
 * 
 * 使用示例:
 * ```
 * $client = new ApiClient('https://api.example.com', 'api_key', 'secret_key');
 * $response = $client->get('/users', ['page' => 1]);
 * ```
 * 
 * @throws ApiClientException 当API请求失败时抛出异常
 */
class ApiClient
{
    private $apiKey;
    private $secretKey;
    private $timeout = 30;
    private $verifySSL = true;
    private $lastRequestInfo = [];
    private $defaultHeaders = [];

    /**
     * 构造函数
     * 
     * @param string $apiKey  API密钥（可选）
     * @param string $secretKey 签名密钥（可选）
     */
    public function __construct(string $apiKey = '', string $secretKey = '')
    {
        $this->apiKey = $apiKey;
        $this->secretKey = $secretKey;
    }

    /**
     * 设置请求超时时间（秒）
     */
    public function setTimeout(int $seconds): self
    {
        $this->timeout = $seconds;
        return $this;
    }

    /**
     * 设置是否验证SSL证书
     */
    public function setVerifySSL(bool $verify): self
    {
        $this->verifySSL = $verify;
        return $this;
    }

    /**
     * 添加默认请求头
     */
    public function addDefaultHeader(string $name, string $value): self
    {
        $this->defaultHeaders[$name] = $value;
        return $this;
    }

    /**
     * 发送GET请求
     * 
     * @param string $endpoint 接口端点
     * @param array  $query    查询参数
     * @param array  $headers  额外请求头
     */
    public function get(string $endpoint, array $query = [], array $headers = []): array
    {
        return $this->request('GET', $endpoint, [
            'query' => $query,
            'headers' => $headers
        ]);
    }

    /**
     * 发送POST请求（表单格式）
     * 
     * @param string $endpoint 接口端点
     * @param array  $data     POST数据
     * @param array  $headers  额外请求头
     */
    public function post(string $endpoint, array $data = [], array $headers = []): array
    {
        return $this->request('POST', $endpoint, [
            'form_data' => $data,
            'headers' => $headers
        ]);
    }

    /**
     * 发送POST请求（JSON格式）
     * 
     * @param string $endpoint 接口端点
     * @param array  $data     POST数据
     * @param array  $headers  额外请求头
     */
    public function postJson(string $endpoint, array $data = [], array $headers = []): array
    {
        return $this->request('POST', $endpoint, [
            'json' => $data,
            'headers' => array_merge(['Content-Type' => 'application/json'], $headers)
        ]);
    }

    /**
     * 发送PUT请求
     */
    public function put(string $endpoint, array $data = [], array $headers = []): array
    {
        return $this->request('PUT', $endpoint, [
            'json' => $data,
            'headers' => $headers
        ]);
    }

    /**
     * 发送DELETE请求
     */
    public function delete(string $endpoint, array $data = [], array $headers = []): array
    {
        return $this->request('DELETE', $endpoint, [
            'json' => $data,
            'headers' => $headers
        ]);
    }

    /**
     * 获取最后一次请求的详细信息
     */
    public function getLastRequestInfo(): array
    {
        return $this->lastRequestInfo;
    }

    /**
     * 基础请求方法
     */
    private function request(string $method, string $endpoint, array $options = []): array
    {
        // 初始化cURL
        $ch = curl_init();
        $url = ltrim($endpoint, '/');

        // 准备请求头
        $headers = $this->prepareHeaders($options['headers'] ?? []);

        // 处理查询参数
        if (!empty($options['query'])) {
            $url .= '?' . http_build_query($options['query']);
        }

        // 处理请求体
        $postData = null;
        if (isset($options['form_data'])) {
            $postData = http_build_query($options['form_data']);
            $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        } elseif (isset($options['json'])) {
            $postData = json_encode($options['json']);
            $headers[] = 'Content-Type: application/json';
        }

        // 设置cURL选项
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_SSL_VERIFYPEER => $this->verifySSL,
            CURLOPT_SSL_VERIFYHOST => $this->verifySSL,
            CURLOPT_HEADER => true,
        ]);

        if ($method !== 'GET' && $postData !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        }

        // 执行请求
        $response = curl_exec($ch);
        $error = curl_error($ch);
        $info = $this->lastRequestInfo = curl_getinfo($ch);
        curl_close($ch);

        // 处理错误
        if ($error) {
            throw new ApiClientException("cURL请求失败: " . $error);
        }

        // 分离响应头和响应体
        $headerSize = $info['header_size'];
        $responseHeaders = substr($response, 0, $headerSize);
        $responseBody = substr($response, $headerSize);

        // 解析响应
        $result = json_decode($responseBody, true) ?? $responseBody;

        // 检查HTTP状态码
        if ($info['http_code'] >= 400) {
            $errorMsg = is_array($result) ? ($result['message'] ?? $responseBody) : $responseBody;
            throw new ApiClientException("API请求失败: " . $errorMsg, $info['http_code']);
        }

        return [
            'status' => $info['http_code'],
            'headers' => $this->parseHeaders($responseHeaders),
            'data' => $result
        ];
    }

    /**
     * 准备请求头（自动添加签名）
     */
    private function prepareHeaders(array $headers): array
    {
        // 合并默认头
        $headers = array_merge($this->defaultHeaders, $headers);

        // 添加签名头
        if ($this->apiKey && $this->secretKey) {
            $timestamp = time();
            $signString = "key={$this->apiKey}&timestamp={$timestamp}";
            $signature = hash_hmac('sha256', $signString, $this->secretKey);

            $headers['X-Api-Key'] = $this->apiKey;
            $headers['X-Api-Timestamp'] = $timestamp;
            $headers['X-Api-Sign'] = $signature;
        }

        // 转换为cURL格式
        $curlHeaders = [];
        foreach ($headers as $name => $value) {
            $curlHeaders[] = "$name: $value";
        }

        return $curlHeaders;
    }

    /**
     * 解析响应头
     */
    private function parseHeaders(string $headers): array
    {
        $parsed = [];
        foreach (explode("\r\n", $headers) as $i => $line) {
            if ($i === 0) {
                $parsed['HTTP_CODE'] = $line;
            } else {
                $parts = explode(': ', $line, 2);
                if (count($parts) === 2) {
                    $parsed[$parts[0]] = $parts[1];
                }
            }
        }
        return $parsed;
    }
}

class ApiClientException extends \Exception
{
    // 自定义异常类
}




