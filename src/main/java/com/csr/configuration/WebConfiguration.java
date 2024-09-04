package com.csr.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private String[] resourcesURL = {"/bootstrap-5.2.3/**", "/controllerjs/**", "/css/**", "/DataTables/**", "/fontawesome-6.4.2/**", "/images/**", "/script/**"};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSec) throws Exception {
        httpSec.authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers(resourcesURL).permitAll()
                            .requestMatchers("/login").permitAll()
                            .requestMatchers("/createadmin").permitAll()
                            .requestMatchers("/dashboard").permitAll()
                            .requestMatchers("/employee/**").hasAnyAuthority("Admin", "General Manager", "Production Manager", "Sale & Account Manager","Designer")
                            .requestMatchers("/user/**").hasAnyAuthority("Admin", "General Manager", "Production Manager", "Sale & Account Manager","Designer")
                            .requestMatchers("/customer/**").permitAll()
                            .requestMatchers("/privilege").hasAnyAuthority("Admin", "General Manager", "Production Manager", "Sale & Account Manager")
                            .requestMatchers("/material").permitAll()
                            .requestMatchers("/product/**").permitAll()
                            .requestMatchers("/customerorder/**").permitAll()
                            .anyRequest().authenticated();

                }).
                formLogin(login -> {
                    login.loginPage("/login")
                            .usernameParameter("username")
                            .passwordParameter("password")
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=usernameandpassworderror");
                })
                .logout(logout -> {
                    logout.logoutUrl("/logout")
                            .logoutSuccessUrl("/login");
                })
                .csrf((csrf)->{
                    csrf.disable();
                })
                .exceptionHandling(exception -> {
                    exception.accessDeniedPage("/error");
                });

        return httpSec.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}
