FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S biar && adduser -S biar -G biar
WORKDIR /app
COPY target/*.jar app.jar
RUN chown -R biar:biar /app
USER biar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
