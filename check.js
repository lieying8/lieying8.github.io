/* by shang    v1.8   */




const websites = [
    'http://8dsa.com',
    'http://2.9qaz.com',
    'https://xiaobaodang.com',
    'https://shang8888.com:5001',
    'http://shang.iask.in:5000',
    'https://a.9qaz.com',
    // 添加更多网站
];

function checkWebsites() {
    let allNormal = true;
    let results = [];
    let promises = [];

    const checkSite = (site) => {
        return new Promise((resolve) => {
            console.log(`Checking: ${site}`);  // 添加日志输出
            $task.fetch({ url: site, method: 'GET', timeout: 10000 }).then(response => {  // 设置超时时间为10秒
                console.log(`Checked: ${site} with status ${response.statusCode}`);  // 添加日志输出
                if (response.statusCode !== 200) {
                    allNormal = false;
                    results.push(`${site} 打不开，状态码：${response.statusCode}`);
                } else {
                    results.push(`${site} 正常打开，状态码：${response.statusCode}`);
                }
                resolve();
            }).catch(error => {
                allNormal = false;
                let errorMessage = error.error ? error.error : JSON.stringify(error);
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }
                console.log(`Error checking: ${site} - ${errorMessage}`);  // 添加日志输出
                results.push(`${site} 打不开，错误：${errorMessage}`);
                resolve();
            });
        });
    };

    websites.forEach(site => {
        promises.push(checkSite(site));
    });

    Promise.all(promises)
        .then(() => {
            console.log('All checks completed');  // 添加日志输出
            if (allNormal) {
                $notify("网站检测", "所有网站正常打开", results.join("\n") || "所有网站正常打开");
            } else {
                $notify("网站检测", "部分网站打不开", results.join("\n"));
            }
            $done();  // 确保脚本结束
        })
        .catch(error => {
            $notify("网站检测", "检测过程中发生错误", JSON.stringify(error));
            $done();  // 确保脚本结束
        });
}

checkWebsites();
