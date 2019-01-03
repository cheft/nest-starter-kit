import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serverless from 'aws-serverless-express';

const express = require('express')();
let cachedServer;

function bootstrapServer() {
  return NestFactory.create(AppModule, express, {
    logger: false,
  })
    // .then(app => app.enableCors())
    .then(app => app.setGlobalPrefix('api/v1'))
    .then(app => app.init())
    .then(() => serverless.createServer(express));
}

export const handler = (event, context) => {
  if (!cachedServer) {
    bootstrapServer().then((server) => {
      cachedServer = server;
      return serverless.proxy(server, event, context);
    });
  } else {
    return serverless.proxy(cachedServer, event, context);
  }
};
