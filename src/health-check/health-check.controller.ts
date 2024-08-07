import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthCheck() {
    return {
      ok: true,
      message: 'Health Check, Client Gateway is up and running'
    }
  }
}
