package com.br.oticavitturino.main.model.repository.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.model.domain.admin.Admin;
import com.br.oticavitturino.main.model.domain.user.TypeProfile;
import com.br.oticavitturino.main.model.domain.user.User;

import jakarta.persistence.EntityManager;

@SpringBootTest
@Transactional
class UserRepositoryInheritanceTest {

    @Autowired
    private UserRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndLoadsAdminUsingJoinedInheritance() {
        Admin admin = new Admin();
        admin.setName("encrypted-name");
        admin.setEmail("encrypted-email");
        admin.setEmailLookupHash("lookup-hash");
        admin.setPassword("encoded-password");
        admin.setActive(true);
        admin.setProfile(TypeProfile.ADMIN);
        admin.setMyReferralCode("ADMIN001");

        User saved = repository.saveAndFlush(admin);
        entityManager.clear();

        User loaded = repository.findById(saved.getId()).orElseThrow();
        assertInstanceOf(Admin.class, loaded);
        assertEquals(TypeProfile.ADMIN, loaded.getProfile());

        Number adminRows = (Number) entityManager
                .createNativeQuery("select count(*) from admin where id = :id")
                .setParameter("id", saved.getId())
                .getSingleResult();
        assertEquals(1L, adminRows.longValue());
    }
}
