function predeal (res) {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !==200 ) {
        error = new Error('请求失败： ' + `状态码为${statusCode}`)
    }

    if (error) {
        console.error(error.message);
        res.resume();
        return
    }
}

module.exports = predeal