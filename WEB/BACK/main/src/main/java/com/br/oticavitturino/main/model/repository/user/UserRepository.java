package com.br.oticavitturino.main.model.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.br.oticavitturino.main.model.domain.user.User;

public interface UserRepository extends JpaRepository<User, Long>{
    UserDetails findByEmail(String email);
    User findByEmailLookupHash(String emailLookupHash);
    User findByMyReferralCode(String myReferralCode);
}