class UserAlreadyExistsException(Exception):
    def __init__(self, detail: str = "The user with this email already exists in the system"):
        self.detail = detail

class ResourceNotFoundException(Exception):
    def __init__(self, detail: str = "Resource not found"):
        self.detail = detail

class InvalidCredentialsException(Exception):
    def __init__(self, detail: str = "Incorrect email or password"):
        self.detail = detail

class FileProcessingException(Exception):
    def __init__(self, detail: str = "An error occurred while processing the file"):
        self.detail = detail
