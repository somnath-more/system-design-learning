package com.tinyurl.backend.repository;

import com.tinyurl.backend.model.TinyUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TinyUrlRepository extends JpaRepository<TinyUrl,Long> {
}
