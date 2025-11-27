package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.address.AddressRequest;
import com.utephonehub.backend.dto.address.AddressResponse;
import com.utephonehub.backend.entity.Address;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.AddressRepository;
import com.utephonehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getUserAddresses(Long userId) {
        log.info("Getting addresses for user id: {}", userId);
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        log.info("Creating address for user id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Address address = Address.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .streetAddress(request.getStreetAddress())
                .ward(request.getWard())
                .wardCode(request.getWardCode())
                .province(request.getProvince())
                .provinceCode(request.getProvinceCode())
                .isDefault(request.getIsDefault() != null && request.getIsDefault())
                .build();

        // If this is set as default, unset other defaults
        if (address.getIsDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setIsDefault(false);
                        addressRepository.save(defaultAddress);
                    });
        }

        address = addressRepository.save(address);
        log.info("Address created successfully with id: {}", address.getId());

        return AddressResponse.fromEntity(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        log.info("Updating address id: {} for user id: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại"));

        address.setRecipientName(request.getRecipientName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setStreetAddress(request.getStreetAddress());
        address.setWard(request.getWard());
        address.setWardCode(request.getWardCode());
        address.setProvince(request.getProvince());
        address.setProvinceCode(request.getProvinceCode());

        // If this is set as default, unset other defaults
        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setIsDefault(false);
                        addressRepository.save(defaultAddress);
                    });
            address.setIsDefault(true);
        } else if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        address = addressRepository.save(address);
        log.info("Address updated successfully with id: {}", addressId);

        return AddressResponse.fromEntity(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        log.info("Deleting address id: {} for user id: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại"));

        addressRepository.delete(address);
        log.info("Address deleted successfully with id: {}", addressId);
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        log.info("Setting default address id: {} for user id: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại"));

        // Unset other defaults
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(defaultAddress -> {
                    defaultAddress.setIsDefault(false);
                    addressRepository.save(defaultAddress);
                });

        address.setIsDefault(true);
        address = addressRepository.save(address);

        log.info("Default address set successfully with id: {}", addressId);
        return AddressResponse.fromEntity(address);
    }
}

