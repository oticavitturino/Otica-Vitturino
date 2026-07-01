package com.br.oticavitturino.main.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.infra.security.TokenService;
import com.br.oticavitturino.main.model.domain.user.AuthenticationDTO;
import com.br.oticavitturino.main.model.domain.user.LoginResponseDTO;
import com.br.oticavitturino.main.model.domain.user.RegisterUserDTO;
import com.br.oticavitturino.main.model.service.user.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login (@RequestBody AuthenticationDTO data) {
        var useremailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(useremailPassword);

        var token = tokenService.generateToken(auth.getPrincipal());

        var user = (com.br.oticavitturino.main.model.domain.user.User) auth.getPrincipal();

        return ResponseEntity.ok(new LoginResponseDTO(token, user.getMyReferralCode()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register (@RequestBody RegisterUserDTO data) {
        service.register(data);
        return ResponseEntity.ok().build();
    }
}