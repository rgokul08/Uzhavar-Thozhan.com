import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";

// Farmer profiles
export const farmerProfiles = pgTable("farmer_profiles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  password: text("password").notNull(),
  village: varchar("village", { length: 255 }),
  district: varchar("district", { length: 255 }),
  state: varchar("state", { length: 255 }),
  landSize: decimal("land_size", { precision: 10, scale: 2 }),
  soilType: varchar("soil_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Crop recommendations
export const cropRecommendations = pgTable("crop_recommendations", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  soilType: varchar("soil_type", { length: 100 }),
  nitrogen: decimal("nitrogen", { precision: 6, scale: 2 }),
  phosphorus: decimal("phosphorus", { precision: 6, scale: 2 }),
  potassium: decimal("potassium", { precision: 6, scale: 2 }),
  ph: decimal("ph", { precision: 4, scale: 2 }),
  recommendedCrops: jsonb("recommended_crops"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Soil reports
export const soilReports = pgTable("soil_reports", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  nitrogen: decimal("nitrogen", { precision: 6, scale: 2 }),
  phosphorus: decimal("phosphorus", { precision: 6, scale: 2 }),
  potassium: decimal("potassium", { precision: 6, scale: 2 }),
  ph: decimal("ph", { precision: 4, scale: 2 }),
  organicCarbon: decimal("organic_carbon", { precision: 6, scale: 2 }),
  healthScore: integer("health_score"),
  advice: text("advice"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Government schemes
export const govSchemes = pgTable("gov_schemes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  benefit: text("benefit"),
  eligibility: text("eligibility"),
  link: text("link"),
  category: varchar("category", { length: 100 }),
  isActive: boolean("is_active").default(true),
});

// Insurance policies
export const insurancePolicies = pgTable("insurance_policies", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  cropName: varchar("crop_name", { length: 255 }),
  policyNumber: varchar("policy_number", { length: 100 }),
  sumInsured: decimal("sum_insured", { precision: 12, scale: 2 }),
  premiumAmount: decimal("premium_amount", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("active"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insurance claims
export const insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").references(() => insurancePolicies.id),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  reason: text("reason"),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending"),
  claimAmount: decimal("claim_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Marketplace products
export const marketplaceProducts = pgTable("marketplace_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }),
  stock: integer("stock").default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  productId: integer("product_id").references(() => marketplaceProducts.id),
  quantity: integer("quantity"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Produce listings
export const produceListings = pgTable("produce_listings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  cropName: varchar("crop_name", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Loan applications
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  loanType: varchar("loan_type", { length: 100 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  purpose: text("purpose"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipment bookings
export const equipmentBookings = pgTable("equipment_bookings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  equipmentName: varchar("equipment_name", { length: 255 }),
  equipmentType: varchar("equipment_type", { length: 100 }),
  bookingDate: timestamp("booking_date"),
  duration: integer("duration"),
  status: varchar("status", { length: 50 }).default("pending"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expert consultations
export const expertConsultations = pgTable("expert_consultations", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  expertName: varchar("expert_name", { length: 255 }),
  specialization: varchar("specialization", { length: 255 }),
  scheduledAt: timestamp("scheduled_at"),
  status: varchar("status", { length: 50 }).default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  title: varchar("title", { length: 500 }),
  content: text("content"),
  category: varchar("category", { length: 100 }),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Weather logs
export const weatherLogs = pgTable("weather_logs", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmerProfiles.id),
  location: varchar("location", { length: 255 }),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  rainfall: decimal("rainfall", { precision: 6, scale: 2 }),
  forecast: jsonb("forecast"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
