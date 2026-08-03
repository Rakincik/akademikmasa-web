--
-- PostgreSQL database dump
--

\restrict VIVO4YClI2xaWE9eflzsy8Ha6tdHFm5q34ZHSlbs7E8emQ1JvQ8ewfkDJrAd9yV

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: root
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO root;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    "discountType" text NOT NULL,
    "discountValue" double precision NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "influencerEmail" text,
    "influencerName" text,
    "isInfluencer" boolean DEFAULT false NOT NULL,
    "endDate" timestamp(3) without time zone,
    "startDate" timestamp(3) without time zone,
    "totalRevenue" double precision DEFAULT 0 NOT NULL,
    "usageLimit" integer,
    "usedCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO root;

--
-- Name: Instructor; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Instructor" (
    id text NOT NULL,
    name text NOT NULL,
    title text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    branch text,
    department text,
    motto text
);


ALTER TABLE public."Instructor" OWNER TO root;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "totalAmount" double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "couponId" text
);


ALTER TABLE public."Order" OWNER TO root;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO root;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    "longDescription" text,
    price double precision NOT NULL,
    "salePrice" double precision,
    "imageUrl" text,
    badge text,
    "priceBadge" text,
    rating double precision DEFAULT 5.0,
    "reviewCount" integer DEFAULT 0,
    "studentCount" text,
    features text[],
    "pricingFeatures" text[],
    "isPublished" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO root;

--
-- Name: SiteContent; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SiteContent" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteContent" OWNER TO root;

--
-- Name: User; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    phone text,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO root;

--
-- Name: _ProductCategories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."_ProductCategories" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductCategories" OWNER TO root;

--
-- Name: _ProductInstructors; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."_ProductInstructors" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductInstructors" OWNER TO root;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Category" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
cms2k0fmp0001rr2yswp9pxe8	CANLI DERS	canli-ders	2026-07-27 01:34:20.45	2026-07-27 01:34:20.45
cms2kzw6f0009k21wk7efh2sr	VİDEO DERS	video-ders	2026-07-27 02:01:54.855	2026-07-27 02:01:54.855
cms2l03do000ak21wpp2e9c21	KİTAP	kitap	2026-07-27 02:02:04.189	2026-07-27 02:02:04.189
cms2l08ae000bk21wl56hwbp3	SORU KAMPLARI	soru-kamplari	2026-07-27 02:02:10.55	2026-07-27 02:02:10.55
cms2l0g5q000ck21w4r7ylebg	2027 ERKEN KAYIT FIRSATLARI	2027-erken-kayit-firsatlari	2026-07-27 02:02:20.751	2026-07-27 02:02:20.751
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Coupon" (id, code, "discountType", "discountValue", "isActive", "createdAt", "updatedAt", "influencerEmail", "influencerName", "isInfluencer", "endDate", "startDate", "totalRevenue", "usageLimit", "usedCount") FROM stdin;
\.


--
-- Data for Name: Instructor; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Instructor" (id, name, title, "imageUrl", "createdAt", "updatedAt", branch, department, motto) FROM stdin;
cms2kmxbn0001k21wdhcmsyz6	Harun Dinçoğlu	Yeni Türk Edebiyatı	https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop	2026-07-27 01:51:49.811	2026-07-27 01:51:49.811	Yeni Türk Edebiyatı	Türkçe ÖABT	Edebiyatın derinliklerinde yeni bir yolculuğa hazır mısınız?
cms2kmxbo0002k21wt7ov5br6	Dr. İlker Hayat	Eski Türk Edebiyatı	https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop	2026-07-27 01:51:49.813	2026-07-27 01:51:49.813	Eski Türk Edebiyatı	Türkçe ÖABT	Geçmişin bilgeliğini günümüzün sınav stratejisiyle birleştiriyoruz.
cms2kmxbp0003k21wy60gdung	Bülent Hoca	Halk Edebiyatı	https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop	2026-07-27 01:51:49.814	2026-07-27 01:51:49.814	Halk Edebiyatı	Türkçe ÖABT	Halkın sesini, sınavın ritmiyle yakalayın.
cms2kmxbr0004k21wm8s2rnfi	Gizem Ural	Çocuk Edebiyatı	https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop	2026-07-27 01:51:49.815	2026-07-27 01:51:49.815	Çocuk Edebiyatı	Türkçe ÖABT	Geleceğin öğretmenlerine ilham veren çocuk edebiyatı dersleri.
cms2kmxbs0005k21w58bty9rm	Mehmet Fatih Muş	Edebiyat Teorileri	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop	2026-07-27 01:51:49.817	2026-07-27 01:51:49.817	Edebiyat Teorileri	Türkçe ÖABT	Teoriyi pratiğe, bilgiyi nete dönüştürmenin formülü.
cms2kmxbu0006k21w3xmjufn9	Soner Özkan	Dil Bilim	https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop	2026-07-27 01:51:49.818	2026-07-27 01:51:49.818	Dil Bilim	Türkçe ÖABT	Dilin şifrelerini çözüyor, sınavda fark yaratıyoruz.
cms2kmxbv0007k21w8w4a95np	Murat Aytekin	Eski Türk Edebiyatı	https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1999&auto=format&fit=crop	2026-07-27 01:51:49.82	2026-07-27 01:51:49.82	Eski Türk Edebiyatı	Türkçe ÖABT	Edebiyat tarihini ezberletmiyor, yaşatıyoruz.
cms2kmxbw0008k21wv9xcjf8n	Ayşe Yılmaz	Eğitim Bilimleri	https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=1936&auto=format&fit=crop	2026-07-27 01:51:49.821	2026-07-27 01:51:49.821	Eğitim Bilimleri	MEB-AGS	Eğitim bilimlerinde ezberi bozan, akılda kalıcı yöntemler.
cms2kmxbi0000k21wvt7ewg3f	Zuhal Bedirhan	4 Temel Beceri	/uploads/319108a497ff495b43a9b660cd5b9ba9.jpg	2026-07-27 01:51:49.806	2026-07-27 01:59:26.397	4 Temel Beceri	Türkçe ÖABT	Eğitimde sınırları zorlayan, yenilikçi yaklaşımlar.
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Order" (id, "userId", "totalAmount", status, "createdAt", "updatedAt", "couponId") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."OrderItem" (id, "orderId", "productId", price) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Product" (id, title, slug, description, "longDescription", price, "salePrice", "imageUrl", badge, "priceBadge", rating, "reviewCount", "studentCount", features, "pricingFeatures", "isPublished", "order", "createdAt", "updatedAt") FROM stdin;
cms2m9uo1000210kwtxqpefw1	2027 TÜRKÇE ÖABT ERKEN KAYIT VİDEO DERS	2027-turkce-oabt-erken-kayit-video-ders	Konu Anlatımı - Ara Tekrar Soru Çözümleri - Rehberlik Dersleri - Yıl Sonu Soru Kampı - Online Denemeler - 2026 Videoları Hediye	<p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">2026-2027&nbsp;DERSLERİMİZ&nbsp;2026&nbsp;EKİM&nbsp;AYINDA&nbsp;BAŞLAYACAKTIR.&nbsp;İŞLENEN&nbsp;DERSLERİN&nbsp;VİDEOLARI,&nbsp;2027&nbsp;SINAVINA&nbsp;KADAR&nbsp;ERİŞİME&nbsp;AÇIKTIR.&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">2026&nbsp;DERS&nbsp;VİDEOLARI&nbsp;HEDİYEDİR.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DERSLERİN&nbsp;TAKİBİ&nbsp;ESNASINDA&nbsp;KULLANACAĞINIZ&nbsp;DERS&nbsp;İZLEME&nbsp;DEFTERLERİ&nbsp;DERSLER&nbsp;BAŞLAMADAN&nbsp;1&nbsp;HAFTA&nbsp;ÖNCE&nbsp;PANELİNİZE&nbsp;TOPLU&nbsp;OLARAK&nbsp;YÜKLENİR.&nbsp;İNDİRİP,&nbsp;ÇIKTI&nbsp;ALABİLİRSİNİZ.&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">HER&nbsp;DERS&nbsp;İÇİN&nbsp;SORU&nbsp;BANKALARI&nbsp;ADRESİNİZE&nbsp;KASIM&nbsp;AYINDA&nbsp;GÖNDERİLECEKTİR.&nbsp;(Adres&nbsp;bilginizin&nbsp;siteye&nbsp;üye&nbsp;olurken&nbsp;doğru&nbsp;ve&nbsp;eksiksiz&nbsp;şekilde&nbsp;girilmesi&nbsp;sizlerin&nbsp;sorumluluğundadır.&nbsp;Eksik,&nbsp;hatalı&nbsp;adreslere&nbsp;kitap&nbsp;ulaşamaması&nbsp;durumunda&nbsp;yeniden&nbsp;gönderim&nbsp;yapılamayacaktır.)</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÖZGÜN&nbsp;VE&nbsp;SINAV&nbsp;FORMATINDAKİ&nbsp;SORULARDAN&nbsp;OLUŞAN&nbsp;5&nbsp;ONLİNE&nbsp;DENEME&nbsp;SINAVINA&nbsp;ÜCRETSİZ&nbsp;KATILIM&nbsp;SAĞLAYABİLİRSİNİZ.&nbsp;SINAVLARDA&nbsp;BAŞARI&nbsp;SIRALAMANIZI&nbsp;GÖREBİLİRSİNİZ.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÖABT&nbsp;DERSLERİ&nbsp;HAFTA&nbsp;İÇİ&nbsp;4&nbsp;GÜN&nbsp;18:00&nbsp;DAN&nbsp;SONRA&nbsp;YAPILIR.&nbsp;AGS&nbsp;DERSLERİ&nbsp;HAFTA&nbsp;SONU&nbsp;YAPILIR.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">CANLI&nbsp;DERS&nbsp;TAMAMLANDIKTAN&nbsp;15&nbsp;DAKİKA&nbsp;SONRA&nbsp;DERSİN&nbsp;VİDEOSU&nbsp;PANELİNİZE&nbsp;YÜKLENİR.&nbsp;YIL&nbsp;BOYUNCA&nbsp;BÜTÜN&nbsp;VİDEOLARI&nbsp;DİLEDİĞİNİZ&nbsp;KADAR&nbsp;İZLEYEBİLİRSİNİZ.(SİSTEMİMİZDE&nbsp;VİDEO&nbsp;HIZLANDIRMA&nbsp;ÖZELLİĞİ&nbsp;MEVCUTTUR)</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DERSLERİMİZ&nbsp;&nbsp;MAYIS&nbsp;SONUNDA&nbsp;TAMAMLANIR&nbsp;VE&nbsp;SONRASINDA&nbsp;KAMP&nbsp;SÜRECİ&nbsp;BAŞLAR.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ALMIŞ&nbsp;OLDUĞUNUZ&nbsp;PAKETİN&nbsp;ANA&nbsp;SORU&nbsp;ÇÖZÜM&nbsp;KAMP&nbsp;PROGRAMI&nbsp;HEDİYEMİZDİR.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">TOPLAM&nbsp;495&nbsp;DERS&nbsp;SAATİNİN&nbsp;DAĞILIMI&nbsp;AŞAĞIDAKİ&nbsp;GİBİDİR:&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">4&nbsp;TEMEL&nbsp;BECERİ:&nbsp;80&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DİL&nbsp;BİLGİSİ:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DİL&nbsp;BİLİMİ:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÇOCUK&nbsp;EDEBİYATI:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">YENİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">HALK&nbsp;EDEBİYATI:&nbsp;50&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ESKİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DÜNYA&nbsp;EDEBİYATI:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">YIL&nbsp;SONU&nbsp;GENEL&nbsp;TEKRAR&nbsp;KAMPI&nbsp;:&nbsp;110&nbsp;SAAT</span></p>	14000	12000	/uploads/394d02bf0d80f2fd6b522b0e26c5d10b.jpeg			5	0		{"4 TEMEL BECERİ: 80 SAAT","DİL BİLGİSİ: 60 SAAT","DİL BİLİMİ: 25 SAAT","ÇOCUK EDEBİYATI: 25 SAAT","YENİ TÜRK EDEBİYATI: 60 SAAT","HALK EDEBİYATI: 50 SAAT","ESKİ TÜRK EDEBİYATI: 60 SAAT","DÜNYA EDEBİYATI: 25 SAAT","YIL SONU GENEL TEKRAR KAMPI : 110 SAAT"}	{}	t	0	2026-07-27 02:37:39.073	2026-07-27 03:12:07.504
cms2lzz88000110kw5clseeym	2027 TÜRKÇE ÖABT ERKEN KAYIT CANLI	2027-turkce-oabt-erken-kayit-canli	Konu Anlatımı - Ara Tekrar Soru Çözümleri - Rehberlik Dersleri - Yıl Sonu Soru Kampı - Online Denemeler - 2026 Videoları Hediye	<p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">2026&nbsp;-&nbsp;2027&nbsp;DERSLERİMİZ&nbsp;2026&nbsp;EKİM&nbsp;AYINDA&nbsp;BAŞLAYACAKTIR.&nbsp;İŞLENEN&nbsp;DERSLERİN&nbsp;VİDEOLARI,&nbsp;2027&nbsp;SINAVINA&nbsp;KADAR&nbsp;ERİŞİME&nbsp;AÇIKTIR.&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">2026&nbsp;DERS&nbsp;VİDEOLARI&nbsp;HEDİYEDİR.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DERSLERİN&nbsp;TAKİBİ&nbsp;ESNASINDA&nbsp;KULLANACAĞINIZ&nbsp;DERS&nbsp;İZLEME&nbsp;DEFTERLERİ&nbsp;DERSLER&nbsp;BAŞLAMADAN&nbsp;1&nbsp;HAFTA&nbsp;ÖNCE&nbsp;PANELİNİZE&nbsp;TOPLU&nbsp;OLARAK&nbsp;YÜKLENİR.&nbsp;İNDİRİP,&nbsp;ÇIKTI&nbsp;ALABİLİRSİNİZ.&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">HER&nbsp;DERS&nbsp;İÇİN&nbsp;SORU&nbsp;BANKALARI&nbsp;ADRESİNİZE&nbsp;KASIM&nbsp;AYINDA&nbsp;GÖNDERİLECEKTİR.&nbsp;(Adres&nbsp;bilginizin&nbsp;siteye&nbsp;üye&nbsp;olurken&nbsp;doğru&nbsp;ve&nbsp;eksiksiz&nbsp;şekilde&nbsp;girilmesi&nbsp;sizlerin&nbsp;sorumluluğundadır.&nbsp;Eksik,&nbsp;hatalı&nbsp;adreslere&nbsp;kitap&nbsp;ulaşamaması&nbsp;durumunda&nbsp;yeniden&nbsp;gönderim&nbsp;yapılamayacaktır.)</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÖZGÜN&nbsp;VE&nbsp;SINAV&nbsp;FORMATINDAKİ&nbsp;SORULARDAN&nbsp;OLUŞAN&nbsp;5&nbsp;ONLİNE&nbsp;DENEME&nbsp;SINAVINA&nbsp;ÜCRETSİZ&nbsp;KATILIM&nbsp;SAĞLAYABİLİRSİNİZ.&nbsp;SINAVLARDA&nbsp;BAŞARI&nbsp;SIRALAMANIZI&nbsp;GÖREBİLİRSİNİZ.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÖABT&nbsp;DERSLERİ&nbsp;HAFTA&nbsp;İÇİ&nbsp;4&nbsp;GÜN&nbsp;18:00&nbsp;DAN&nbsp;SONRA&nbsp;YAPILIR.&nbsp;AGS&nbsp;DERSLERİ&nbsp;HAFTA&nbsp;SONU&nbsp;YAPILIR.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">CANLI&nbsp;DERS&nbsp;TAMAMLANDIKTAN&nbsp;15&nbsp;DAKİKA&nbsp;SONRA&nbsp;DERSİN&nbsp;VİDEOSU&nbsp;PANELİNİZE&nbsp;YÜKLENİR.&nbsp;YIL&nbsp;BOYUNCA&nbsp;BÜTÜN&nbsp;VİDEOLARI&nbsp;DİLEDİĞİNİZ&nbsp;KADAR&nbsp;İZLEYEBİLİRSİNİZ.(SİSTEMİMİZDE&nbsp;VİDEO&nbsp;HIZLANDIRMA&nbsp;ÖZELLİĞİ&nbsp;MEVCUTTUR)</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DERSLERİMİZ&nbsp;&nbsp;MAYIS&nbsp;SONUNDA&nbsp;TAMAMLANIR&nbsp;VE&nbsp;SONRASINDA&nbsp;KAMP&nbsp;SÜRECİ&nbsp;BAŞLAR.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ALMIŞ&nbsp;OLDUĞUNUZ&nbsp;PAKETİN&nbsp;ANA&nbsp;SORU&nbsp;ÇÖZÜM&nbsp;KAMP&nbsp;PROGRAMI&nbsp;HEDİYEMİZDİR.</span></p><p></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">TOPLAM&nbsp;495&nbsp;DERS&nbsp;SAATİNİN&nbsp;DAĞILIMI&nbsp;AŞAĞIDAKİ&nbsp;GİBİDİR:&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">&nbsp;</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">4&nbsp;TEMEL&nbsp;BECERİ:&nbsp;80&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DİL&nbsp;BİLGİSİ:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DİL&nbsp;BİLİMİ:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ÇOCUK&nbsp;EDEBİYATI:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">YENİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">HALK&nbsp;EDEBİYATI:&nbsp;50&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">ESKİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;60&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">DÜNYA&nbsp;EDEBİYATI:&nbsp;25&nbsp;SAAT</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgba(33, 37, 41, 0.75);">YIL&nbsp;SONU&nbsp;GENEL&nbsp;TEKRAR&nbsp;KAMPI&nbsp;:&nbsp;110&nbsp;SAAT</span></p>	18000	14000	/uploads/e060639064829855ee80d0fab328a3e5.png			5	0		{"4 TEMEL BECERİ: 80 SAAT","DİL BİLGİSİ: 60 SAAT","DİL BİLİMİ: 25 SAAT","ÇOCUK EDEBİYATI: 25 SAAT","YENİ TÜRK EDEBİYATI: 60 SAAT","HALK EDEBİYATI: 50 SAAT","ESKİ TÜRK EDEBİYATI: 60 SAAT","DÜNYA EDEBİYATI: 25 SAAT","YIL SONU GENEL TEKRAR KAMPI : 110 SAAT"}	{"Anında Erişime Açılır"}	t	0	2026-07-27 02:29:58.424	2026-07-27 03:12:17.109
\.


--
-- Data for Name: SiteContent; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."SiteContent" (id, "pageId", title, content, "createdAt", "updatedAt") FROM stdin;
cms543wdm000041odxbh3ykx2	home	Ana Sayfa	{"hero":{"badge":"2027 Erken Kayıt Fırsatları Başladı","title1":"Geleceğinize","title2":"Akademik Masa","title3":"ile Hazırlanın.","description":"Uzman kadromuzla KPSS, ÖABT ve tüm akademik sınavlarda hedeflerinize en hızlı şekilde ulaşın. Hemen kaydolun, rakiplerinizin bir adım önüne geçin.","imageUrl":"/api/uploads/d18669ff7dc8a92da3104b12cbbb5930.png","stats":[{"value":"5.000+","label":"Mutlu Derece Öğrencisi"},{"value":"%98.4","label":"Başarı Oranı"}]}}	2026-07-28 20:32:26.794	2026-07-28 20:54:31.411
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."User" (id, email, password, name, phone, role, "createdAt", "updatedAt") FROM stdin;
cms2k08jd0000rr2y1gt5ysrn	admin@akademikmasa.com	Ufuk.Zu.2026	Ufuk Evliyaoğlu	\N	ADMIN	2026-07-27 01:34:11.258	2026-07-27 01:39:01.493
\.


--
-- Data for Name: _ProductCategories; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."_ProductCategories" ("A", "B") FROM stdin;
cms2kzw6f0009k21wk7efh2sr	cms2m9uo1000210kwtxqpefw1
cms2l0g5q000ck21w4r7ylebg	cms2m9uo1000210kwtxqpefw1
cms2k0fmp0001rr2yswp9pxe8	cms2lzz88000110kw5clseeym
cms2l0g5q000ck21w4r7ylebg	cms2lzz88000110kw5clseeym
\.


--
-- Data for Name: _ProductInstructors; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."_ProductInstructors" ("A", "B") FROM stdin;
cms2kmxbn0001k21wdhcmsyz6	cms2m9uo1000210kwtxqpefw1
cms2kmxbo0002k21wt7ov5br6	cms2m9uo1000210kwtxqpefw1
cms2kmxbp0003k21wy60gdung	cms2m9uo1000210kwtxqpefw1
cms2kmxbr0004k21wm8s2rnfi	cms2m9uo1000210kwtxqpefw1
cms2kmxbs0005k21w58bty9rm	cms2m9uo1000210kwtxqpefw1
cms2kmxbu0006k21w3xmjufn9	cms2m9uo1000210kwtxqpefw1
cms2kmxbv0007k21w8w4a95np	cms2m9uo1000210kwtxqpefw1
cms2kmxbw0008k21wv9xcjf8n	cms2m9uo1000210kwtxqpefw1
cms2kmxbi0000k21wvt7ewg3f	cms2m9uo1000210kwtxqpefw1
cms2kmxbn0001k21wdhcmsyz6	cms2lzz88000110kw5clseeym
cms2kmxbo0002k21wt7ov5br6	cms2lzz88000110kw5clseeym
cms2kmxbp0003k21wy60gdung	cms2lzz88000110kw5clseeym
cms2kmxbr0004k21wm8s2rnfi	cms2lzz88000110kw5clseeym
cms2kmxbs0005k21w58bty9rm	cms2lzz88000110kw5clseeym
cms2kmxbu0006k21w3xmjufn9	cms2lzz88000110kw5clseeym
cms2kmxbv0007k21w8w4a95np	cms2lzz88000110kw5clseeym
cms2kmxbw0008k21wv9xcjf8n	cms2lzz88000110kw5clseeym
cms2kmxbi0000k21wvt7ewg3f	cms2lzz88000110kw5clseeym
\.


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: Instructor Instructor_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Instructor"
    ADD CONSTRAINT "Instructor_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: SiteContent SiteContent_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SiteContent"
    ADD CONSTRAINT "SiteContent_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: SiteContent_pageId_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "SiteContent_pageId_key" ON public."SiteContent" USING btree ("pageId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _ProductCategories_AB_unique; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "_ProductCategories_AB_unique" ON public."_ProductCategories" USING btree ("A", "B");


--
-- Name: _ProductCategories_B_index; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "_ProductCategories_B_index" ON public."_ProductCategories" USING btree ("B");


--
-- Name: _ProductInstructors_AB_unique; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "_ProductInstructors_AB_unique" ON public."_ProductInstructors" USING btree ("A", "B");


--
-- Name: _ProductInstructors_B_index; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "_ProductInstructors_B_index" ON public."_ProductInstructors" USING btree ("B");


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ProductCategories _ProductCategories_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."_ProductCategories"
    ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductCategories _ProductCategories_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."_ProductCategories"
    ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductInstructors _ProductInstructors_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."_ProductInstructors"
    ADD CONSTRAINT "_ProductInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES public."Instructor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductInstructors _ProductInstructors_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."_ProductInstructors"
    ADD CONSTRAINT "_ProductInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict VIVO4YClI2xaWE9eflzsy8Ha6tdHFm5q34ZHSlbs7E8emQ1JvQ8ewfkDJrAd9yV

