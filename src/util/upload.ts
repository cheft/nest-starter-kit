let OSS = require('ali-oss');
import { extname } from 'path'

let client = new OSS({
  region: 'oss-cn-shenzhen',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIIuqHYqYHsuJ9',
  accessKeySecret: 'V3TlQ1lfOipY831RolzwqoqWeQKn1l',
  bucket: 'dev-ggt-public'
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default async function (originalname, buffer) {
  let name = uuidv4() + extname(originalname);
  return await client.put(name, buffer);
}
