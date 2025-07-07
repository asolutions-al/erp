-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."PLAN_ID" AS ENUM('INVOICE-STARTER', 'INVOICE-PRO', 'INVOICE-BUSINESS');--> statement-breakpoint
CREATE TYPE "public"."PRODUCT" AS ENUM('INVOICE');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan" (
	"product" "PRODUCT" NOT NULL,
	"name" text NOT NULL,
	"monthlyPrice" double precision NOT NULL,
	"yearlyPrice" double precision NOT NULL,
	"id" "PLAN_ID" PRIMARY KEY NOT NULL,
	"maxInvoices" bigint NOT NULL,
	"maxUnits" bigint NOT NULL,
	"maxMembers" bigint NOT NULL,
	"maxCustomers" bigint NOT NULL,
	"maxProducts" bigint NOT NULL,
	"tier" smallint NOT NULL,
	"paypalPlanId" text NOT NULL,
	"paypalSandboxPlanId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan" ENABLE ROW LEVEL SECURITY;
*/