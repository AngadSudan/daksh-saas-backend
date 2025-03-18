class ApiResponse {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.success = status < 400;
    if (status < 400) {
      this.data = data;
      this.error = null;
    } else {
      this.data = null;
      this.error = data;
    }
  }
}

export default ApiResponse;
