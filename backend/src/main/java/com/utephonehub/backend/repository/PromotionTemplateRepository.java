package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.PromotionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionTemplateRepository extends JpaRepository<PromotionTemplate, String> {
}