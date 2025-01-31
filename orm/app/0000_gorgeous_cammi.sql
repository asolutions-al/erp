-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."IdType" AS ENUM('tin', 'id');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('ALL', 'EUR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."discountType" AS ENUM('value', 'percentage');--> statement-breakpoint
CREATE TYPE "public"."payMethod" AS ENUM('cash', 'card', 'bank', 'other');--> statement-breakpoint
CREATE TYPE "public"."recordStatus" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"displayName" text
);
--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"unitId" uuid NOT NULL,
	"total" double precision NOT NULL,
	"payMethod" "payMethod" NOT NULL,
	"currency" "currency" NOT NULL,
	"customerId" uuid NOT NULL,
	"exchangeRate" double precision NOT NULL,
	"discountValue" double precision NOT NULL,
	"discountType" "discountType" NOT NULL,
	"notes" text,
	"status" "recordStatus" NOT NULL,
	"orgId" uuid NOT NULL,
	"subtotal" double precision NOT NULL,
	"tax" double precision NOT NULL,
	"date" timestamp with time zone,
	"customer" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"ownerId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"unitId" uuid NOT NULL,
	"name" text NOT NULL,
	"status" "status" NOT NULL,
	"description" text,
	"imageBucketPath" text,
	"idType" "IdType",
	"email" text,
	"address" text,
	"city" text,
	"idValue" text,
	"orgId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"orgId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "unit" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"unitId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"unitId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"orgId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitation" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"unitId" uuid NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"status" "status" NOT NULL,
	"barcode" text,
	"description" text,
	"imageBucketPath" text,
	"orgId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "invoiceRow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"productId" uuid NOT NULL,
	"name" text NOT NULL,
	"quantity" double precision NOT NULL,
	"unitPrice" real NOT NULL,
	"invoiceId" uuid NOT NULL,
	"total" double precision NOT NULL,
	"unitId" uuid NOT NULL,
	"orgId" uuid NOT NULL,
	"subtotal" double precision NOT NULL,
	"tax" double precision NOT NULL,
	"product" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoiceRow" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "unit" ADD CONSTRAINT "unit_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoiceRow" ADD CONSTRAINT "invoiceRow_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoiceRow" ADD CONSTRAINT "invoiceRow_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoiceRow" ADD CONSTRAINT "invoiceRow_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoiceRow" ADD CONSTRAINT "invoiceRow_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE cascade;
*/