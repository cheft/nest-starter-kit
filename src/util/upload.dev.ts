const OSS = require('ali-oss');
import { extname } from 'path';

const client = new OSS({
  region: 'oss-cn-shenzhen',
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS（dev）。
  accessKeyId: 'xxxx',
  accessKeySecret: 'xxxx',
  bucket: 'dev-xxx-xxxx',
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* tslint:disable:one-variable-per-declaration */
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default async function (originalname, buffer) {
  const name = 'images/' + uuidv4() + extname(originalname);
  return await client.put(name, buffer);
}
