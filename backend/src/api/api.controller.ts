import { ApiService } from "./api.service";
import { Controller, Get } from "@nestjs/common";


@Controller("api")
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
}
