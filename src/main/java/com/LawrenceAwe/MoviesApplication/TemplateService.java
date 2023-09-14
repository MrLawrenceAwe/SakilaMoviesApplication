package com.LawrenceAwe.MoviesApplication;

import com.hubspot.jinjava.Jinjava;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

@Service
public class TemplateService {
    private static Jinjava jinjava = new Jinjava();
    private static ResourceLoader resourceLoader = new ResourceLoader();

    public TemplateService() {
        this(new Jinjava(), new ResourceLoader());
    }

    public TemplateService(Jinjava jinjava, ResourceLoader resourceLoader) {
        this.jinjava = jinjava;
        this.resourceLoader = resourceLoader;
    }

    public static String renderTemplate(String templatePath, Map<String, Object> contextMap) throws IOException {
        String template = resourceLoader.load(templatePath);
        return jinjava.render(template, contextMap);
    }

    public static class ResourceLoader {
        public String load(String path) throws IOException, IllegalArgumentException {
            Resource resource = new ClassPathResource(path);
            if (!resource.exists()) {
                throw new IOException("File object is null");
            } else {
                resource.getFile();
            }
            return new String(Files.readAllBytes(resource.getFile().toPath()));
        }
    }
}
