package com.br.oticavitturino.main;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class MainApplication {
    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(MainApplication.class, args);
    }

    // Carrega o arquivo .env
    private static void loadDotEnv() {
        Path directory = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (directory != null) {
            Path envFile = directory.resolve(".env");
            if (Files.isRegularFile(envFile)) {
                Dotenv dotenv = Dotenv.configure()
                    .directory(directory.toString())
                    .filename(".env")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
                dotenv.entries().forEach(entry -> {
                    if (System.getenv(entry.getKey()) == null
                            && System.getProperty(entry.getKey()) == null) {
                        System.setProperty(entry.getKey(), entry.getValue());
                    }
                });
                return;
            }
            directory = directory.getParent();
        }
    }
}