import { Injectable, HttpService } from '@nestjs/common';
import * as crypto from 'crypto';
import * as Qs from 'qs';

@Injectable()
export class AdminVideoService {
  constructor(private readonly httpService: HttpService) {
  }
/**
 * author:Luc
 * 根据标题获取视频列表
 */
  async getAllByTag(keyword, query) {
    const url = 'http://api.polyv.net/v2/video/f290a9f238/search';
    const time = Date.now();
    const str = `keyword=${keyword}&ptime=' + time + 'JaXdmDa118`;
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    const hash = sha1.digest('hex').toUpperCase();
    const data = {
      keyword,
      ptime: time,
      sign: hash,
    };
    const result = await this.httpService.post(url, Qs.stringify(data), {
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).toPromise();
    console.log(result);
    return result.data;
  }

  async getClassification() {
    const url = 'http://api.polyv.net/v2/video/f290a9f238/cataJson';
    const time = Date.now();
    const str = `ptime=${time}&userid=f290a9f238JaXdmDa118`;
    console.log('--------------------', str);
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    const hash = sha1.digest('hex').toUpperCase();
    const data = {
      ptime: time,
      sign: hash,
    };
    const result = await this.httpService.post(url, Qs.stringify(data), {
      headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
    }).toPromise();
    return result.data;
  }

  async getAll(treeId, query) {
    const url = 'http://api.polyv.net/v2/video/f290a9f238/get-new-list';
    const time = Date.now();
    const str = `catatree=${treeId}&ptime=' + time + 'JaXdmDa118`;
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    const hash = sha1.digest('hex').toUpperCase();
    const data = {
      catatree:treeId,
      ptime: time,
      sign: hash,
    };
    const result = await this.httpService.post(url, Qs.stringify(data), {
      headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
    }).toPromise();
    return result.data;
  }

  async getOne(vid) {
    const url = 'http://api.polyv.net/v2/video/f290a9f238/get-video-msg';
    const time = Date.now();
    const str = `format=json&ptime=${time}&vid=${vid}JaXdmDa118`;
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    const hash = sha1.digest('hex').toUpperCase();
    const data = {
      vid,
      ptime: time,
      sign: hash,
      format: 'json',
    };

    const result = await this.httpService.post(url, Qs.stringify(data), {
      headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
    }).toPromise();
    return result.data;
  }
}
