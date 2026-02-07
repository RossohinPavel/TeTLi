import { ApiService } from "./api.service";
import { Controller } from "@nestjs/common";


@Controller("api")
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
}
