import React from 'react'
import { Link } from 'react-router-dom';
import img1 from "../assets/logo.png";
import bedImg from '../assets/bed.jpg';
import bathLinenImg from '../assets/bath linen (1).jpg'
import kitchenLinenImg from '../assets/kitchen linen (1).jpg'
import livingImg from '../assets/living.jpg'
import tableImg from '../assets/table.jpg'
import img2 from '../assets/img2.png'
import imag1 from '../assets/imag1.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.png'
import nameJpeg from '../assets/name.jpeg'

function Home1() {
  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tex Weave Impex | Best Indian Home Textile Exporter in Karur</title>
  <link rel="icon" type="image/png" href="logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Poppins:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n\n        body {\n            font-family: 'Roboto', Arial, sans-serif;\n            line-height: 1.6;\n            color: #303030;\n            background-color: #ffffff;\n        }\n\n        header {\n            background-color: #ffffff;\n            padding: 18px 0;\n            box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n            position: sticky;\n            top: 0;\n            z-index: 1000;\n            transition: all 0.3s ease;\n            border-bottom: 1px solid #e8e8e8;\n        }\n\n        .container {\n            max-width: 1200px;\n            margin: 0 auto;\n            padding: 0 30px;\n        }\n\n        .header-content {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 20px;\n        }\n\n        .logo {\n            display: flex;\n            align-items: center;\n            flex-shrink: 0;\n        }\n\n        .logo h3 {\n            font-size: 28px;\n            font-weight: 800;\n            color: #315291;\n            letter-spacing: 2px;\n            font-family: 'Poppins', sans-serif;\n            margin: 0;\n            text-transform: uppercase;\n        }\n\n        .logo img {\n            max-height: 50px;\n            height: 50px;\n            width: auto;\n            object-fit: contain;\n        }\n\n        nav {\n            display: flex;\n            align-items: center;\n            margin-left: auto;\n        }\n\n        nav ul {\n            list-style: none;\n            display: flex;\n            gap: 32px;\n            margin: 0;\n            padding: 0;\n            align-items: center;\n        }\n\n        nav li {\n            margin: 0;\n            padding: 0;\n        }\n\n        nav a {\n            text-decoration: none;\n            color: #315291;\n            font-weight: 600;\n            font-size: 13px;\n            letter-spacing: 1px;\n            transition: all 0.3s ease;\n            position: relative;\n            white-space: nowrap;\n            padding: 8px 0;\n            display: inline-block;\n            text-transform: uppercase;\n        }\n\n        nav a:hover {\n            color: #c7be1f;\n        }\n\n        nav a::before {\n            content: '';\n            position: absolute;\n            width: 0;\n            height: 2px;\n            bottom: 0;\n            left: 50%;\n            transform: translateX(-50%);\n            background-color: #c7be1f;\n            transition: width 0.3s ease;\n        }\n\n        nav a:hover::before {\n            width: 100%;\n        }\n\n        .hero {\n            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), \n                        url('https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=1920&h=950&fit=crop') center/cover;\n            height: 700px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            color: white;\n            text-align: center;\n            position: relative;\n        }\n\n        .hero-content {\n            animation: fadeInUp 1s ease;\n        }\n\n        @keyframes fadeInUp {\n            from {\n                opacity: 0;\n                transform: translateY(30px);\n            }\n            to {\n                opacity: 1;\n                transform: translateY(0);\n            }\n        }\n\n        .hero-content p {\n            font-size: 36px;\n            margin-bottom: 15px;\n            color: #f1f0f3;\n            font-weight: 500;\n            letter-spacing: 1px;\n            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n        }\n\n        .hero-content h1 {\n            font-size: 66px;\n            margin-bottom: 30px;\n            font-weight: 700;\n            letter-spacing: 10px;\n            line-height: 1.2;\n            text-shadow: 3px 3px 6px rgba(0,0,0,0.5);\n            font-family: 'Poppins', sans-serif;\n        }\n\n        .section {\n            padding: 90px 0;\n        }\n\n        .section-title {\n            text-align: center;\n            font-size: 42px;\n            margin-bottom: 25px;\n            color: #000000;\n            font-weight: 700;\n            font-family: 'Poppins', sans-serif;\n        }\n\n        .section-divider {\n            width: 70px;\n            height: 4px;\n            background-color: #303030;\n            margin: 0 auto 50px;\n        }\n\n        .journey-text {\n            text-align: center;\n            max-width: 900px;\n            margin: 0 auto;\n            font-size: 16px;\n            line-height: 2em;\n            color: #303030;\n        }\n\n        .features {\n            background: linear-gradient(rgba(50,81,159,0.85), rgba(50,81,159,0.85)),\n                        url('https://images.unsplash.com/photo-1586281380614-bf2b7f93cd10?w=1920&h=600&fit=crop') center/cover;\n            color: white;\n            position: relative;\n        }\n\n        .features-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));\n            gap: 50px;\n            margin-top: 60px;\n        }\n\n        .feature-item {\n            text-align: center;\n            padding: 40px 30px;\n            transition: transform 0.3s ease;\n        }\n\n        .feature-item:hover {\n            transform: translateY(-10px);\n        }\n\n        .feature-icon {\n            width: 128px;\n            height: 128px;\n            background-color: transparent;\n            border-radius: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            margin: 0 auto 25px;\n            font-size: 60px;\n        }\n\n        .feature-item h3 {\n            margin-bottom: 20px;\n            font-size: 18px;\n            font-weight: 700;\n            letter-spacing: 1px;\n        }\n\n        .feature-item p {\n            line-height: 1.8;\n            font-size: 15px;\n        }\n\n        .products-section {\n            position: relative;\n            margin-top: 60px;\n            overflow: hidden;\n            padding: 0 60px;\n        }\n\n        .products-grid {\n            display: flex;\n            overflow: visible;\n            gap: 20px;\n            animation: infiniteScroll 25s linear infinite;\n        }\n\n        @keyframes infiniteScroll {\n            0% {\n                transform: translateX(0);\n            }\n            100% {\n                transform: translateX(calc(-50% - 10px));\n            }\n        }\n\n        .products-grid:hover {\n            animation-play-state: paused;\n        }\n\n        .product-card {\n            position: relative;\n            overflow: hidden;\n            transition: all 0.4s ease;\n            height: 400px;\n            min-width: 280px;\n            max-width: 280px;\n            flex-shrink: 0;\n            border-radius: 8px;\n            box-shadow: 0 4px 15px rgba(0,0,0,0.1);\n        }\n\n        .product-card:hover {\n            transform: translateY(-10px);\n            box-shadow: 0 8px 25px rgba(0,0,0,0.15);\n            z-index: 10;\n        }\n\n        .product-image {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n            transition: transform 0.4s ease;\n        }\n\n        .product-card:hover .product-image {\n            transform: scale(1.1);\n        }\n\n        .product-overlay {\n            position: absolute;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.3) 60%, transparent);\n            color: white;\n            padding: 25px;\n            text-align: center;\n            display: flex;\n            flex-direction: column;\n            justify-content: flex-end;\n            opacity: 0;\n            transition: opacity 0.4s ease;\n        }\n\n        .product-card:hover .product-overlay {\n            opacity: 1;\n        }\n\n        .product-overlay h3 {\n            margin-bottom: 15px;\n            font-size: 22px;\n            font-weight: 700;\n            font-family: 'Poppins', sans-serif;\n        }\n\n        .product-category {\n            font-size: 14px;\n            color: #c7be1f;\n            margin-bottom: 15px;\n        }\n\n        .separator-small {\n            width: 70px;\n            height: 2px;\n            background-color: #c7be1f;\n            margin: 10px auto;\n        }\n\n        .product-button {\n            display: inline-block;\n            padding: 8px 28px;\n            background-color: transparent;\n            border: 2px solid #ffffff;\n            color: #ffffff;\n            text-decoration: none;\n            font-size: 13px;\n            font-weight: 600;\n            letter-spacing: 1px;\n            transition: all 0.3s ease;\n            margin-top: 10px;\n        }\n\n        .product-button:hover {\n            background-color: #c7be1f;\n            border-color: #c7be1f;\n            color: #262626;\n        }\n\n        .carousel-arrow {\n            position: absolute;\n            top: 50%;\n            transform: translateY(-50%);\n            background-color: #c7be1f;\n            border: none;\n            color: #ffffff;\n            width: 55px;\n            height: 55px;\n            border-radius: 50%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            cursor: pointer;\n            font-size: 26px;\n            font-weight: bold;\n            z-index: 100;\n            transition: all 0.3s ease;\n            box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n        }\n\n        .carousel-arrow:hover {\n            background-color: #315291;\n            transform: translateY(-50%) scale(1.15);\n            box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n        }\n\n        .carousel-arrow.prev {\n            left: 10px;\n        }\n\n        .carousel-arrow.next {\n            right: 10px;\n        }\n\n        .stats {\n            background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)),\n                        url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=500&fit=crop') center/cover fixed;\n            color: white;\n            background-attachment: fixed;\n        }\n\n        .stats-grid {\n            display: grid;\n            grid-template-columns: repeat(4, 1fr);\n            gap: 60px;\n            text-align: center;\n        }\n\n        .stat-item {\n            padding: 40px 20px;\n        }\n\n        .stat-number {\n            font-size: 60px;\n            font-weight: 700;\n            color: #ffffff;\n            margin-bottom: 20px;\n            font-family: 'Poppins', sans-serif;\n        }\n\n        .stat-divider {\n            width: 70px;\n            height: 4px;\n            background-color: #c7be1f;\n            margin: 20px auto;\n        }\n\n        .stat-text {\n            font-size: 18px;\n            color: #ffffff;\n            font-weight: 500;\n            letter-spacing: 0.5px;\n        }\n\n        footer {\n            background-color: #1a1a1a;\n            color: #c7c7c7;\n            padding: 60px 0 30px;\n        }\n\n        .footer-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 50px;\n            margin-bottom: 40px;\n        }\n\n        .footer-col h5 {\n            color: #ffffff;\n            margin-bottom: 25px;\n            font-size: 16px;\n            font-weight: 700;\n            text-transform: uppercase;\n        }\n\n        .footer-col p, .footer-col a {\n            color: #c7c7c7;\n            line-height: 2;\n            font-size: 14px;\n        }\n\n        .footer-col a {\n            text-decoration: none;\n            transition: color 0.3s;\n            display: block;\n            margin-bottom: 8px;\n        }\n\n        .footer-col a:hover {\n            color: #c7be1f;\n        }\n\n        .social-icons {\n            margin-top: 20px;\n        }\n\n        .social-icons a {\n            display: inline-block;\n            width: 35px;\n            height: 35px;\n            line-height: 35px;\n            text-align: center;\n            margin-right: 10px;\n            color: #ffffff;\n            background-color: transparent;\n            border: 1px solid #4a4a4a;\n            transition: all 0.3s;\n            font-size: 17px;\n        }\n\n        .social-icons a:hover {\n            background-color: #c7be1f;\n            border-color: #c7be1f;\n            color: #262626;\n        }\n\n        .footer-bottom {\n            border-top: 1px solid #333;\n            padding-top: 25px;\n            text-align: center;\n            color: #888;\n            font-size: 16px;\n        }\n\n        .footer-bottom a {\n            color: #c7be1f;\n            text-decoration: none;\n        }\n\n        .footer-logo {\n            max-width: 250px;\n            margin-bottom: 20px;\n        }\n\n        .back-to-top {\n            position: fixed;\n            bottom: 30px;\n            right: 30px;\n            width: 50px;\n            height: 50px;\n            background-color: #c7be1f;\n            color: #262626;\n            border: none;\n            border-radius: 50%;\n            font-size: 20px;\n            cursor: pointer;\n            opacity: 0;\n            visibility: hidden;\n            transition: all 0.3s;\n            z-index: 999;\n        }\n\n        .back-to-top.show {\n            opacity: 1;\n            visibility: visible;\n        }\n\n        .back-to-top:hover {\n            background-color: #315291;\n            color: #ffffff;\n            transform: translateY(-5px);\n        }\n\n        .mobile-menu-button {\n            display: none;\n            font-size: 24px;\n            color: #315291;\n            cursor: pointer;\n        }\n\n        @media (max-width: 1024px) {\n            nav ul {\n                display: none;\n            }\n\n            .mobile-menu-button {\n                display: block;\n            }\n\n            .hero-content h1 {\n                font-size: 42px;\n                letter-spacing: 5px;\n            }\n\n            .hero-content p {\n                font-size: 24px;\n            }\n\n            .section-title {\n                font-size: 32px;\n            }\n\n            .features-grid,\n            .products-grid,\n            .stats-grid {\n                grid-template-columns: 1fr;\n            }\n        }\n\n        @media (max-width: 600px) {\n            .hero-content h1 {\n                font-size: 28px;\n                letter-spacing: 2px;\n            }\n\n            .hero-content p {\n                font-size: 18px;\n            }\n\n            .section-title {\n                font-size: 24px;\n            }\n\n            .stat-number {\n                font-size: 48px;\n            }\n        }\n\n        /* Process Section Styles */\n        .process-section {\n            background-color: #f9f9f9;\n        }\n\n        .process-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));\n            gap: 40px;\n            margin-top: 60px;\n        }\n\n        .process-card {\n            background: #ffffff;\n            padding: 35px;\n            border-radius: 8px;\n            box-shadow: 0 4px 15px rgba(0,0,0,0.08);\n            transition: all 0.3s ease;\n            border-left: 4px solid #315291;\n        }\n\n        .process-card:hover {\n            transform: translateY(-8px);\n            box-shadow: 0 8px 25px rgba(0,0,0,0.15);\n            border-left-color: #c7be1f;\n        }\n\n        .process-card h3 {\n            color: #315291;\n            font-size: 22px;\n            margin-bottom: 20px;\n            font-weight: 700;\n            font-family: 'Poppins', sans-serif;\n            letter-spacing: 1px;\n        }\n\n        .process-card p {\n            color: #555;\n            line-height: 1.9;\n            font-size: 15px;\n            text-align: justify;\n        }\n\n        .process-icon {\n            width: 70px;\n            height: 70px;\n            background: linear-gradient(135deg, #315291 0%, #4a73b8 100%);\n            border-radius: 50%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            margin-bottom: 20px;\n            font-size: 32px;\n            color: #ffffff;\n        }\n\n        /* Certification Section Styles */\n        .certification-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n            gap: 40px;\n            margin-top: 60px;\n            max-width: 1000px;\n            margin-left: auto;\n            margin-right: auto;\n        }\n\n        .certification-card {\n            background: #ffffff;\n            padding: 30px;\n            border: 2px solid #e0e0e0;\n            border-radius: 8px;\n            transition: all 0.3s ease;\n            cursor: pointer;\n            text-align: center;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.05);\n        }\n\n        .certification-card:hover {\n            transform: translateY(-10px);\n            box-shadow: 0 8px 25px rgba(0,0,0,0.15);\n            border-color: #315291;\n        }\n\n        .certification-card img {\n            width: 100%;\n            height: auto;\n            max-height: 180px;\n            object-fit: contain;\n            margin-bottom: 15px;\n        }\n\n        .certification-card h3 {\n            font-size: 16px;\n            color: #303030;\n            font-weight: 600;\n            margin-top: 15px;\n        }\n\n        /* Modal Styles */\n        .certification-modal {\n            display: none;\n            position: fixed;\n            z-index: 9999;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            background-color: rgba(0, 0, 0, 0.9);\n            overflow: auto;\n        }\n\n        .modal-content {\n            background-color: #ffffff;\n            margin: 3% auto;\n            padding: 0;\n            border-radius: 10px;\n            width: 90%;\n            max-width: 900px;\n            position: relative;\n            animation: modalSlideIn 0.4s ease;\n        }\n\n        @keyframes modalSlideIn {\n            from {\n                transform: translateY(-50px);\n                opacity: 0;\n            }\n            to {\n                transform: translateY(0);\n                opacity: 1;\n            }\n        }\n\n        .modal-header {\n            background: linear-gradient(135deg, #315291 0%, #4a73b8 100%);\n            color: white;\n            padding: 30px;\n            border-radius: 10px 10px 0 0;\n            text-align: center;\n        }\n\n        .modal-header h2 {\n            margin: 0;\n            font-size: 36px;\n            font-weight: 700;\n            font-family: 'Poppins', sans-serif;\n        }\n\n        .modal-header p {\n            margin: 10px 0 0 0;\n            font-size: 16px;\n            opacity: 0.9;\n        }\n\n        .modal-body {\n            padding: 50px;\n        }\n\n        .certifications-display {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n            gap: 30px;\n        }\n\n        .cert-item {\n            background: #f9f9f9;\n            padding: 25px;\n            border-radius: 8px;\n            text-align: center;\n            transition: all 0.3s ease;\n            border: 2px solid #e0e0e0;\n        }\n\n        .cert-item:hover {\n            transform: translateY(-5px);\n            box-shadow: 0 8px 20px rgba(0,0,0,0.1);\n            border-color: #315291;\n        }\n\n        .cert-item img {\n            width: 100%;\n            height: auto;\n            max-height: 150px;\n            object-fit: contain;\n            margin-bottom: 15px;\n        }\n\n        .cert-item h4 {\n            font-size: 14px;\n            color: #303030;\n            margin-top: 10px;\n            font-weight: 600;\n        }\n\n        .close-modal {\n            position: absolute;\n            right: 25px;\n            top: 25px;\n            color: #ffffff;\n            font-size: 35px;\n            font-weight: bold;\n            cursor: pointer;\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            background-color: rgba(255, 255, 255, 0.2);\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            transition: all 0.3s ease;\n        }\n\n        .close-modal:hover {\n            background-color: rgba(255, 255, 255, 0.3);\n            transform: rotate(90deg);\n        }\n\n        @media (max-width: 768px) {\n            .modal-content {\n                width: 95%;\n                margin: 10% auto;\n            }\n\n            .modal-body {\n                padding: 30px 20px;\n            }\n\n            .certifications-display {\n                grid-template-columns: repeat(2, 1fr);\n                gap: 20px;\n            }\n        }\n\n    "
    }}
  />
  {/* Back to Top Button */}
  <button className="back-to-top" id="backToTop">
    <i className="fas fa-arrow-up" />
  </button>
  {/* Header */}
  <header>
    <div className="container">
      <div className="header-content">
        <div className="logo">
          {/* <img src="name.jpeg" alt="TEX WEAVE IMPEX"> */}
          <h3>TEX WEAVE IMPEX</h3>
        </div>
        <div className="mobile-menu-button">
          <i className="fas fa-bars" />
        </div>
        <nav>
          <ul>
            <li>
              <a href="#home">HOME</a>
            </li>
            <li>
              <a href="#about">ABOUT US</a>
            </li>
            <li>
              <a href="#infrastructure">INFRASTRUCTURE</a>
            </li>
            <li>
              <a href="#process">PROCESS</a>
            </li>
            <li>
              <a href="#products">PRODUCTS</a>
            </li>
            <li>
              <a href="#certification">CERTIFICATION</a>
            </li>
            <li>
              <a href="#contact">CONTACT US</a>
            </li>
            <li>
              <Link to="/login">LOGIN</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  {/* Hero Section */}
  <section className="hero" id="home">
    <div className="hero-content">
      <div>
        <p>TEX WEAVE IMPEX - UNIQUE COTTON FABRICS</p>
        <h1>
          100% ECO FRIENDLY
          <br />
          ORGANIC PRODUCTS
        </h1>
      </div>
    </div>
  </section>
  {/* Journey Section */}
  <section className="section" id="about">
    <div className="container">
      <h2 className="section-title">OUR JOURNEY</h2>
      <div className="section-divider" />
      <p className="journey-text">
        Tex Weave Impex, established in the year 1999, are pioneers in
        manufacturing and exporting Home textiles, Furnishings, Made-ups,
        Institutional, Hospitality and Health-care linen. We are inspired by
        trust and driven by a passion for excellence without compromising our
        core values there by helping to establish and build long term
        relationships with our global clients.
      </p>
    </div>
  </section>
  {/* Features Section */}
  <section className="section features" id="infrastructure">
    <div className="container">
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon">
            <img
              src="https://img.icons8.com/ios/128/ffffff/innovation.png"
              alt="Innovation"
            />
          </div>
          <h3>INNOVATION</h3>
          <p>
            To continuously improve our business processes, we innovate new
            efforts, thoughts, and methodologies.
          </p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <img
              src="https://img.icons8.com/ios/128/ffffff/collaboration.png"
              alt="Teamwork"
            />
          </div>
          <h3>TEAM WORK</h3>
          <p>
            Our success is based on the cohesive journey and smartness of each
            and every member of our team.
          </p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <img
              src="https://img.icons8.com/ios/128/ffffff/earth-planet.png"
              alt="Eco Friendly"
            />
          </div>
          <h3>ECO FRIENDLY</h3>
          <p>
            We feel responsible about the earth's sustainability by using
            eco-friendly practices to create a green energy and happy world.
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* Process Section */}
  <section className="section process-section" id="process">
    <div className="container">
      <h2 className="section-title">OUR PROCESS</h2>
      <div className="section-divider" />
      <div className="process-grid">
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-shuttle-van" />
          </div>
          <h3>WEAVING</h3>
          <p>
            Weaving is a process used in the manufacturing of textiles, in which
            two sets of threads, called the warp and the weft, are interlaced at
            right angles to create a fabric.
          </p>
          <p>
            In a home textile manufacturing company, the weaving process
            typically begins with preparing the warp threads, which are arranged
            on a loom in parallel lines. The weft threads are then inserted by
            passing a shuttle back and forth across the loom, interlacing them
            with the warp threads to create the fabric. Different types of looms
            can be used depending on the type of fabric being produced, such as
            a handloom, power loom and Autoloom.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-tint" />
          </div>
          <h3>DYEING</h3>
          <p>
            Dyeing is a process used in the manufacturing of textiles to add
            color to the fabric. In a home textile manufacturing company, the
            fabric is prepared by washing and scouring, then wound onto a dyeing
            machine and immersed in a dye bath containing the dye and necessary
            chemicals.
          </p>
          <p>
            The fabric is agitated and heated in the dye bath to ensure an even
            distribution of dye and then rinsed, washed and dried.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-print" />
          </div>
          <h3>PRINTING</h3>
          <p>
            Printing is a process used in the manufacturing of textiles to add
            designs or patterns to the fabric. The machine applies the design or
            pattern onto the fabric using ink or dye.
          </p>
          <p>
            The fabric is then dried, cured and inspected. The various type of
            printing methods are screen, digital, rotary, block etc will also
            determine the process and machinery used in the printing process.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-pencil-ruler" />
          </div>
          <h3>EMBROIDERY / APPLIQUES</h3>
          <p>
            Embroidery is a process used in the manufacturing of textiles to add
            decorative designs or patterns to the fabric using needle and
            thread, which can be a manual or computerized machine, depending on
            the design and the type of fabric being embroidered.
          </p>
          <p>
            The type of embroidery like chain, satin, cross, aari, dori,
            applique etc will also determine the process and machinery used in
            the embroidery process.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-cut" />
          </div>
          <h3>STITCHING</h3>
          <p>
            Stitching is a process used in the manufacturing of textiles to join
            or hold together different pieces of fabric or to add decorative
            elements to the fabric using thread and needle.
          </p>
          <p>
            The fabric pieces are then placed on a sewing machine and stitched
            together using thread. The sewing machine can be a manual or
            computerized machine depending on the type of fabric and the design.
            The type of stitching like overlock, lockstitch, coverstitch etc
            will also determine the process and machinery used in the stitching
            process.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-check-circle" />
          </div>
          <h3>CHECKING</h3>
          <p>
            Product checking is a process used in the manufacturing of textiles
            to ensure that the finished product meets the required quality
            standards before it is shipped to customers.
          </p>
          <p>
            The product checking process typically includes several steps of
            Inspection under trained supervisors.
          </p>
        </div>
        <div className="process-card">
          <div className="process-icon">
            <i className="fas fa-box" />
          </div>
          <h3>PACKING</h3>
          <p>
            Packing is the final step in the manufacturing process of textiles.
            All the stitched products are thoroughly checked and inspected
            before final packing and packed as per customer's instructions.
          </p>
          <p>
            The steps of packing process includes Counting and sorting,
            Wrapping, Labeling, Packing and Shipping.
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* Products Section */}
  <section className="section" id="products">
    <div className="container">
      <h2 className="section-title">OUR VALUABLE PRODUCTS</h2>
      <div className="section-divider" />
      <div className="products-section">
        <div className="carousel-arrow prev">‹</div>
        <div className="products-grid" id="productCarousel">
          {/* Original set */}
          <div className="product-card">
            <img src={bedImg} alt="Bed Linen" className="product-image" />
            <div className="product-overlay">
              <h3>Bed Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={bathLinenImg}
              alt="Bath Linen"
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Bath Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={kitchenLinenImg}
              alt="Kitchen Linen"
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Kitchen Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={livingImg}
              alt="Living Linen"
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Living Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img src={tableImg} alt="Table Linen" className="product-image" />
            <div className="product-overlay">
              <h3>Table Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          {/* Duplicated set for infinite loop */}
          <div className="product-card">
            <img src={bedImg} alt="Bed Linen" className="product-image" />
            <div className="product-overlay">
              <h3>Bed Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={bathLinenImg}
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Bath Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={kitchenLinenImg}
              alt="Kitchen Linen"
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Kitchen Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img
              src={livingImg}
              alt="Living Linen"
              className="product-image"
            />
            <div className="product-overlay">
              <h3>Living Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
          <div className="product-card">
            <img src={tableImg} alt="Table Linen" className="product-image" />
            <div className="product-overlay">
              <h3>Table Linen</h3>
              <span className="separator-small" />
              <div className="product-category">Business</div>
              <a href="#" className="product-button">
                VIEW
              </a>
            </div>
          </div>
        </div>
        <div className="carousel-arrow next">›</div>
      </div>
    </div>
  </section>
  {/* Stats Section */}
  <section className="section stats">
    <div className="container">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">10</div>
          <div className="stat-divider" />
          <p className="stat-text">COUNTRIES SERVED</p>
        </div>
        <div className="stat-item">
          <div className="stat-number">120</div>
          <div className="stat-divider" />
          <p className="stat-text">EMPLOYEES AT THE FACTORY</p>
        </div>
        <div className="stat-item">
          <div className="stat-number">30000</div>
          <div className="stat-divider" />
          <p className="stat-text">FACTORY SPACE (Sq.Feet)</p>
        </div>
        <div className="stat-item">
          <div className="stat-number">5</div>
          <div className="stat-divider" />
          <p className="stat-text">CERTIFICATIONS</p>
        </div>
      </div>
    </div>
  </section>
  {/* Certification Section */}
  <section className="section" id="certification">
    <div className="container">
      <h2 className="section-title">OUR CERTIFICATION</h2>
      <div className="section-divider" />
      <div className="certification-grid">
        <div className="certification-card" onclick="openCertificationModal()">
          <img src={img2} alt="BSI SA 8000" />
          <h3>SA 8000 Social Accountability</h3>
        </div>
        <div className="certification-card" onclick="openCertificationModal()">
          <img src={imag1} alt="GOTS" />
          <h3>Global Organic Textile Standard</h3>
        </div>
        <div className="certification-card" onclick="openCertificationModal()">
          <img src={img3} alt="Sedex" />
          <h3>Sedex Certification</h3>
        </div>
        <div className="certification-card" onclick="openCertificationModal()">
          <img src={img4} alt="OEKO-TEX" />
          <h3>OEKO-TEX Standard 100</h3>
        </div>
        <div className="certification-card" onclick="openCertificationModal()">
          <img src={img5} alt="CE" />
          <h3>CE Marking</h3>
        </div>
      </div>
    </div>
  </section>
  {/* Certification Modal */}
  <div id="certificationModal" className="certification-modal">
    <div className="modal-content">
      <div className="modal-header">
        <span className="close-modal" onclick="closeCertificationModal()">
          ×
        </span>
        <h2>OUR CERTIFICATION</h2>
        <p>Quality Assurance &amp; Global Standards</p>
      </div>
      <div className="modal-body">
        <div className="certifications-display">
          <div className="cert-item">
            <img src={img2} alt="BSI SA 8000" />
            <h4>SA 8000 Social Accountability</h4>
          </div>
          <div className="cert-item">
            <img src={imag1} alt="GOTS" />
            <h4>Global Organic Textile Standard</h4>
          </div>
          <div className="cert-item">
            <img src={img3} alt="Sedex" />
            <h4>Sedex Certification</h4>
          </div>
          <div className="cert-item">
            <img src={img4} alt="OEKO-TEX" />
            <h4>OEKO-TEX Standard 100</h4>
          </div>
          <div className="cert-item">
            <img src={img5} alt="CE" />
            <h4>CE Marking</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Footer */}
  <footer id="contact">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <img src={nameJpeg} alt="TEX WEAVE IMPEX" className="footer-logo" />
          <p>62/52, Kamarajapuram West, Karur, Tamil Nadu 639002, India</p>
          <p>
            <strong>Email:</strong> info@texweaveimpex.com
          </p>
          <p>
            <strong>Mob:</strong> +91 99423 20990 | +91 9965535770
          </p>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-twitter" />
            </a>
            <a href="#">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#">
              <i className="fab fa-google-plus-g" />
            </a>
            <a href="#">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Our Products</h5>
          <a href="#products">Table Linen</a>
          <a href="#products">Bed Linen</a>
          <a href="#products">Bath Linen</a>
          <a href="#products">Living Linen</a>
          <a href="#products">Kitchen Linen</a>
        </div>
        <div className="footer-col">
          <h5>Important Links</h5>
          <a href="#about">About Us</a>
          <a href="#infrastructure">Infrastructure</a>
          <a href="#process">Process</a>
          <a href="#products">Products</a>
          <a href="#certification">Certifications</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div className="footer-col">
          <h5>Way To Reach Us</h5>
          <p>
            Visit us at our factory location in Karur, Tamil Nadu, India - the
            textile hub of South India.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © Copyright 2026 TEX WEAVE IMPEX | Best Indian Home Textile Exporter
          in Karur
        </p>
      </div>
    </div>
  </footer>
  {/* Code injected by live-server */}
</>


  )
}

export default Home1;