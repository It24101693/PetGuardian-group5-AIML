-- Seed initial veterinary clinic data
INSERT INTO vet (name, type, specialty, address, phone, rating, reviews, is_open, verified, ai_recommended, latitude, longitude)
VALUES 
('Colombo Pet Hospital', 'Hospital', 'General Surgery & Emergency', '123 Ward Place, Colombo 07', '+94 11 234 5678', 4.8, 156, true, true, true, 6.9147, 79.8644),
('City Vet Clinic', 'Clinic', 'Vaccinations & Routine Checkups', '45 Galle Road, Colombo 03', '+94 11 987 6543', 4.5, 89, true, true, false, 6.9012, 79.8519),
('Dr. Perera Animal Care', 'Doctor', 'Avian & Exotic Pets Specialist', '78 Kandy Road, Kelaniya', '+94 77 123 4567', 4.9, 124, false, true, true, 6.9515, 79.9142),
('Negombo Emergency Vet', 'Hospital', '24/7 Trauma & Critical Care', '12 Main St, Negombo', '+94 31 222 3333', 4.2, 210, true, true, false, 7.2089, 79.8354),
('Mount Lavinia Pet Care', 'Clinic', 'Dental & Grooming Services', '210 Hotel Road, Mount Lavinia', '+94 11 555 4444', 4.6, 67, true, false, false, 6.8350, 79.8633);
