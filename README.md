# 4N EcoTech Scheduling Platform

React Native scheduling application built for the 4N EcoTech assignment.

## Overview

This app allows users to register, log in, browse service providers, book appointments, manage upcoming bookings, and reschedule/cancel appointments.

The project is designed with a clean architecture split into:

- `screens/` for UI flows
- `components/` for reusable UI building blocks
- `src/context/` for global state and app actions
- `src/domain/` for booking business rules
- `src/data/storage/` for persistence

## Features Implemented

- User registration and login (mock/local persistence)
- Session handling and logout
- Service provider listing with images and categories
- Provider details with available slots
- Appointment booking with slot selection
- Upcoming appointments list
- Appointment cancellation with confirmation
- Reschedule flow from booking screen
- Duplicate and conflict prevention
- One active appointment per user per provider rule
- UI fallbacks for image loading and storage behavior across web/mobile

## Business Rules

- Same slot cannot be booked by two active appointments.
- One user can have only one active appointment per provider.
- User can have active appointments with different providers.
- Cancelled appointments are excluded from active slot checks.
- Reschedule preserves ownership and updates to a free slot only.

## Tech Stack

- React Native
- Expo
- React Navigation
- Context API
- AsyncStorage (with Expo-safe fallback wrapper)
- JavaScript (ES6+)

## Project Structure

```text
4N-EcoTech-Scheduling-Platform/
   components/
      AppButton.js
      ProviderCard.js
   constants/
      colors.js
   data/
      providers.js
   navigation/
      AppNavigator.js
   screens/
      LoginScreen.js
      RegisterScreen.js
      HomeScreen.js
      ProviderDetailsScreen.js
      BookAppointmentScreen.js
      AppointmentsScreen.js
   src/
      context/
         AuthContext.js
         AppointmentContext.js
      domain/
         appointment/
            appointmentService.js
      data/storage/
         authStorage.js
         appointmentStorage.js
         safeStorage.js
      utils/
         validation.js
```

## Setup and Run

1. Install dependencies

```bash
npm install
```

2. Start Expo

```bash
npx expo start
```

3. Run on target

- Web: press `w` in Expo terminal
- Android Emulator: press `a`
- Expo Go on device: scan QR code

## Android APK Build (Recommended for final submission)

If submitting APK, build a release APK using EAS:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Download the generated APK from the EAS build link and verify install on a physical Android device.

## Assumptions

- No backend server is used for assignment scope; data is local/mock.
- Provider slots are predefined in seed data.
- Notifications and calendar integration are out of scope.

## Expo Go Note

Expo Go can have differences in native storage behavior. The project includes `safeStorage` fallback to keep flows testable even when native storage is unavailable.

## Quality and Validation

- Input validation for name, email, and password
- Error handling with user-friendly messages
- Loading states on async actions
- Empty states for providers/appointments/slots
- Defensive hydration cleanup for appointment data integrity

## Libraries and Tools Used

- `@react-native-async-storage/async-storage`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- Expo SDK tooling

## Submission Checklist

- Source code repository
- Updated README
- APK file
- PPT/PDF with Part I and Part II
- Notes on assumptions, tools, and architecture
