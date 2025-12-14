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

# Build application (clean compile để đảm bảo Lombok generate code)
RUN ./mvnw clean package -DskipTests

# Chạy ứng dụng
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]