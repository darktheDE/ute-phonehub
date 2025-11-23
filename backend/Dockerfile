# Sử dụng image chứa sẵn Java 17
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy file cấu hình maven trước để tận dụng cache layer
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Tải thư viện về (bước này lâu nhất, nhưng docker sẽ cache lại)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Chạy ứng dụng
CMD ["./mvnw", "spring-boot:run"]