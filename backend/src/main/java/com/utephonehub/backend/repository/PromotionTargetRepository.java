package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.PromotionTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionTargetRepository extends JpaRepository<PromotionTarget, Long> {
}