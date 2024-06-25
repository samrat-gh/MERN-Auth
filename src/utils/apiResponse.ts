class ApiResponse {
  statusCode: number;
  success: boolean;
  data: any;
  message: string;
  constructor(
    statusCode: number,
    success = true,
    data: any,
    message = "successful"
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
