package com.example.DigitalWayfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Platform_Functional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmsFunctional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "L1")
    private String l1;
    
    @Column(name = "L2")
    private String l2;
    
    @Column(name = "L3")
    private String l3;
    
    @Column(name = "L4")
    private String l4;
    
    // Constructor for projection
    public TmsFunctional(String l1, String l2, String l3, String l4) {
        this.l1 = l1;
        this.l2 = l2;
        this.l3 = l3;
        this.l4 = l4;
    }
}
