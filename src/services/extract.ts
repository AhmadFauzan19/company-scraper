export async function extractCompanyInfo(rawText: string) {
    const info = {
      description: '',
      productsServices: '',
      businessActivities: '',
      industries: '',
      socialMedia: {
        linkedin: '',
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
      },
      contact: {
        phone: '',
        email: ''
      }
    };
  
    // Define keywords for each section in multiple languages
    const keywords = {
      description: ['about', 'mission', 'overview', 'company profile', 'who we are', 'tentang', 'misi', 'profil perusahaan', 'siapa kami'],
      products: ['products', 'services', 'solutions', 'offerings', 'produk', 'layanan', 'solusi', 'penawaran'],
      activities: ['operations', 'business activities', 'market', 'industries', 'what we do', 'operasi', 'kegiatan bisnis', 'pasar', 'industri', 'apa yang kami lakukan'],
      socialMedia: {
        linkedin: ['linkedin'],
        facebook: ['facebook'],
        twitter: ['twitter', 'x'],
        instagram: ['instagram'],
        youtubt: ['youtube']
      }
    };
  
    // List of industry terms to match against
    const industryTerms = [
      // Manufacturing & Industrial
      'Chemical Manufacturing', 'Industrial Gases', 'Energy', 'Pharmaceuticals', 'Biotechnology', 
      'Aerospace', 'Automotive', 'Construction', 'Electrical Equipment', 'Electronics Manufacturing', 
      'Food Processing', 'Heavy Machinery', 'Metals', 'Textiles', 'Plastics', 'Paper Manufacturing',
      
      // Technology & Software
      'Information Technology', 'Software Development', 'Hardware', 'Telecommunications', 'Cybersecurity', 
      'Semiconductors', 'Artificial Intelligence', 'Blockchain', 'Fintech', 'Internet of Things', 'Cloud Computing',
      'Data Analytics', 'Digital Media', 'E-commerce', 'Video Games', 'Virtual Reality', 'Augmented Reality',
      
      // Finance & Professional Services
      'Banking', 'Finance', 'Insurance', 'Investment Management', 'Accounting', 'Consulting', 'Legal Services',
      'Real Estate', 'Venture Capital', 'Private Equity', 'Wealth Management', 'Hedge Funds', 'Credit Unions',
      
      // Healthcare & Life Sciences
      'Healthcare', 'Medical Devices', 'Biotechnology', 'Pharmaceuticals', 'Clinical Research', 
      'Health Insurance', 'Public Health', 'Mental Health', 'Telemedicine', 'Nutrition', 'Veterinary',
      
      // Retail & Consumer Goods
      'Retail', 'Wholesale', 'E-commerce', 'Consumer Electronics', 'Apparel', 'Footwear', 'Home Goods', 
      'Furniture', 'Luxury Goods', 'Sportswear', 'Beauty Products', 'Cosmetics', 'Personal Care',
      
      // Agriculture & Food
      'Agriculture', 'Food and Beverage', 'Dairy', 'Farming', 'Aquaculture', 'Horticulture', 'Meat Processing', 
      'Beverage Production', 'Organic Foods', 'AgriTech', 'Forestry', 'Winery', 'Brewing',
      
      // Logistics & Transportation
      'Logistics', 'Shipping', 'Freight Forwarding', 'Warehousing', 'Supply Chain', 'Transportation', 
      'Railway', 'Trucking', 'Aviation', 'Maritime', 'Courier Services', 'Airlines', 'Public Transit',
      
      // Energy & Utilities
      'Oil and Gas', 'Renewable Energy', 'Solar Energy', 'Wind Energy', 'Nuclear Energy', 'Hydropower', 
      'Utilities', 'Electricity', 'Natural Gas', 'Water Utilities', 'Waste Management', 'Recycling', 
      
      // Education & Public Services
      'Education', 'Higher Education', 'E-learning', 'Public Administration', 'Government', 'Nonprofit', 
      'Social Services', 'Environmental Services', 'Military', 'Library Services', 'Museums', 'Charitable Organizations',
      
      // Hospitality & Leisure
      'Hospitality', 'Hotels', 'Restaurants', 'Bars', 'Tourism', 'Travel', 'Recreation', 'Event Management', 
      'Sports', 'Gambling', 'Theme Parks', 'Fitness Centers', 'Health Clubs',
      
      // Media & Entertainment
      'Broadcasting', 'Film Production', 'Music', 'Publishing', 'Journalism', 'Public Relations', 'Advertising',
      'Digital Media', 'Streaming Services', 'Gaming', 'Animation', 'Photography', 'Social Media',
      
      // Other Common Sectors
      'Agriculture', 'Construction', 'Consumer Goods', 'Mining', 'Forestry', 'Real Estate', 
      'Human Resources', 'Environmental Services', 'Compliance', 'Risk Management', 'Quality Assurance',
    ];
  
    // Clean text function to normalize content
    const cleanText = (text: string) => text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
    // Split text into paragraphs and filter
    const paragraphs = rawText.split('\n').map(p => p.trim()).filter(p => p.length > 0);
  
    // Unique content checker
    const uniqueContent = new Set<string>();
    const industriesFound = new Set<string>();
  
    paragraphs.forEach(paragraph => {
      const lowerParagraph = paragraph.toLowerCase();
  
      const addUniqueText = (key: 'description' | 'productsServices' | 'businessActivities') => {
        const cleaned = cleanText(paragraph);
        if (!uniqueContent.has(cleaned)) {
          info[key] += cleaned + ' ';
          uniqueContent.add(cleaned);
        }
      };
  
      // Match and add to corresponding section if keywords are found
      if (keywords.description.some(keyword => lowerParagraph.includes(keyword))) {
        addUniqueText('description');
      } else if (keywords.products.some(keyword => lowerParagraph.includes(keyword))) {
        addUniqueText('productsServices');
      } else if (keywords.activities.some(keyword => lowerParagraph.includes(keyword))) {
        addUniqueText('businessActivities');
      }
  
      // Match industry terms
      industryTerms.forEach(industry => {
        if (paragraph.includes(industry) && !industriesFound.has(industry)) {
          industriesFound.add(industry);
        }
      });
  
      // Match social media links
      Object.entries(keywords.socialMedia).forEach(([platform, platformKeywords]) => {
        if (platformKeywords.some(keyword => lowerParagraph.includes(keyword))) {
          const urlMatch = paragraph.match(/https?:\/\/\S+/);
          if (urlMatch) {
            info.socialMedia[platform as keyof typeof info.socialMedia] = urlMatch[0];
          }
        }
      })
    });
  
    // Final clean-up and setting industries
    info.description = cleanText(info.description);
    info.productsServices = cleanText(info.productsServices);
    info.businessActivities = cleanText(info.businessActivities);
    info.industries = Array.from(industriesFound).join(', ');
  
    return info;
  }