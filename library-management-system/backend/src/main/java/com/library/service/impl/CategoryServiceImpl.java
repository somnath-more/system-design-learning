package com.library.service.impl;

import com.library.dto.CategoryDTO;
import com.library.entity.Category;
import com.library.exception.ResourceAlreadyExistsException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryDTO.Response createCategory(CategoryDTO.Request request) {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new ResourceAlreadyExistsException("Category with name " + request.getName() + " already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public CategoryDTO.Response getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToResponse(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO.Response> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO.Response updateCategory(Long id, CategoryDTO.Request request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO.Response convertToResponse(Category category) {
        return CategoryDTO.Response.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdDate(category.getCreatedAt())
                .updatedDate(category.getUpdatedAt())
                .build();
    }
}
