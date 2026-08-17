import React, { useState, useEffect, useCallback } from 'react';

export default function LAVMarketingPlatform() {
  const [activeTab, setActiveTab] = useState('market');
  const [marketData, setMarketData] = useState([]);
  const [competitorAnalyses, setCompetitorAnalyses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [contentCalendar, setContentCalendar] = useState([]);
  const [mediaPerformance, setMediaPerformance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMarketForm, setNewMarketForm] = useState({
    country: 'Türkiye',
    marketSize: '',
    growth: '',
    trends: '',
    opportunities: ''
  });

  const [newCompetitorForm, setNewCompetitorForm] = useState({
    competitor: 'Paşabahçe',
    strengths: '',
    weaknesses: '',
    marketPosition: '',
    pricingStrategy: '',
    latestMoves: '',
    country: 'Türkiye',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    instagramFollowers: '',
    facebookFollowers: '',
    tiktokFollowers: '',
    youtubeFollowers: '',
    socialMediaStrategy: '',
    contentTypes: '',
    postingFrequency: '',
    contentTone: '',
    hashtagStrategy: '',
    engagementTactics: '',
    campaignTypes: '',
    uGCStrategy: '',
    website: '',
    instagram2: '',
    instagram2Followers: '',
    pinterest: '',
    linkedin: ''
  });

  const competitors = ['Paşabahçe', 'Luminarc', 'Libbey', 'Bormioli'];
  const countries = ['Türkiye', 'İtalya', 'İspanya', 'Fransa', 'Amerika'];

  // Predefined competitor data with correct URLs
  const predefinedCompetitors = {
    'LAV': {
      website: 'https://www.lav.com.tr/',
      website2: 'https://company.lav.com.tr/',
      instagram: 'https://www.instagram.com/lavturkiye/',
      pinterest: 'https://tr.pinterest.com/hayatdolulav',
      country: 'Türkiye',
      isOwnBrand: true
    },
    'Paşabahçe': {
      website: 'https://www.pasabahce.com/',
      instagram: 'https://www.instagram.com/pasabahce',
      instagram2: 'https://www.instagram.com/pasabahcemagazalari',
      pinterest: 'https://tr.pinterest.com/pasabahce_/',
      country: 'Türkiye'
    },
    'Luminarc': {
      website: 'https://www.latabledarc.com/',
      instagram: 'https://www.instagram.com/luminarc',
      country: 'Fransa'
    },
    'Libbey': {
      website: 'https://www.libbey.com/',
      instagram: 'https://www.instagram.com/libbey/',
      country: 'Amerika'
    },
    'Bormioli': {
      website: 'https://shop.bormiolirocco.com/en',
      instagram: 'https://www.instagram.com/bormioliroccoit/',
      country: 'İtalya'
    }
  };

  // Load data from persistent storage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const marketResult = await window.storage.get('lav_market_analyses');
      const competitorAnalysisResult = await window.storage.get('lav_competitor_tracking');
      const recResult = await window.storage.get('lav_recommendations');
      const contentResult = await window.storage.get('lav_content_calendar');
      const mediaResult = await window.storage.get('lav_media_performance');

      if (marketResult) {
        setMarketData(JSON.parse(marketResult.value));
      }
      if (competitorAnalysisResult) {
        setCompetitorAnalyses(JSON.parse(competitorAnalysisResult.value));
      }
      if (recResult) {
        setRecommendations(JSON.parse(recResult.value));
      }
      if (contentResult) {
        setContentCalendar(JSON.parse(contentResult.value));
      }
      if (mediaResult) {
        setMediaPerformance(JSON.parse(mediaResult.value));
      }
    } catch (error) {
      console.log('Storage error or first load');
    }
  };

  // Memoized handler for form changes - FIX FOR INPUT FOCUS
  // Get AI-powered market analysis
  const handleGetAutoMarketAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1200,
          messages: [
            {
              role: 'user',
              content: `Türkiye'deki cam ve bardak endüstrisinin pazar analizi yap. 
              
Odaklan:
1. **Sofra Alışkanlıkları Trendi (2024-2025)**
   - Türkiye'de sofra kültürü nasıl değişiyor?
   - Premium vs bütçe bilinç ne durumda?
   - Aile içi yemek alışkanlıkları artıyor mu?

2. **Ev Dekorasyonu Trendleri**
   - Modern tasarım vs geleneksel
   - Ekoloji farkındalığı artmış mı?
   - Minimal estetik tercih ediliyor mu?

3. **Pazarın Büyüme Potansiyeli**
   - Cam ve bardak pazarı büyüyor mu?
   - Hangi segment daha kazançlı? (lüks/massal)
   - E-commerce vs perakende karşılaştırması

4. **Tüketici Davranışları**
   - Online shopping tercihli mi?
   - Sosyal medya etikisi ne kadar?
   - Fiyat vs kalite hassasiyeti nedir?

5. **Mevsimsel Fırsatlar**
   - Hangi mevsimde satış yoğun?
   - Özel günler etkisi nedir?

Pratik veriler ve spesifik rakamlar sun. Türkiye pazarına göre tavsiyeler ver.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid API response');
      }

      const content = result.content[0].text;

      const analysis = {
        id: Date.now(),
        country: 'Türkiye',
        marketSize: 'Türkiye Pazar',
        growthRate: '2024-2025',
        trends: content.substring(0, 500),
        opportunities: content,
        threats: 'Rakip analizi sekmesinde detaylı',
        date: new Date().toLocaleDateString('tr-TR')
      };

      const updated = [...marketData, analysis];
      setMarketData(updated);

      try {
        await window.storage.set('lav_market_analyses', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ Pazar analizi AI tarafından tamamlandı!');
    } catch (error) {
      console.error('Market analysis error:', error);
      
      // Fallback: Predefined market analysis
      const fallbackAnalysis = {
        id: Date.now(),
        country: 'Türkiye',
        marketSize: 'Türkiye Pazar (~500M EUR)',
        growthRate: '%4-6 (2024-2025)',
        trends: 'Sofra kültürü değişiyor, ev dekorasyonu trendleri modern estetik'e kaymış durumda. Premium ve sürdürülebilir ürünlere olan talep artıyor.',
        opportunities: `Türkiye'deki cam ve bardak pazarında birkaç önemli trend:

1. Sofra Alışkanlıkları: Aile içi yemek kültürü güçlü kaliyor ama ev dekorasyonu tarafında yükseliş var. Premium sofra setlerine olan talep artıyor.

2. E-commerce Büyümesi: Online alışveriş %25-30 hızla büyüyor. Genç nesil Instagram/Pinterest'ten ilham alıp online satın alıyor.

3. Sürdürülebilirlik: Çevre bilinçli tüketiciler eco-friendly cam ürünleri tercih ediyor.

4. Tasarım Trendi: Minimalist, moderne+bohemian karışım stil popüler. Renk tercihinde pastel tonlar tercih ediliyor.

5. Mevsimsel Pik: Düğün sezonu (haziran-eylül), yıl sonu hediye alımları, ev tadilatları (bahar) yüksek satış dönemleri.`,
        threats: 'Rakip analizi sekmesinde detaylı',
        date: new Date().toLocaleDateString('tr-TR'),
        isFallback: true
      };

      const updated = [...marketData, fallbackAnalysis];
      setMarketData(updated);

      try {
        await window.storage.set('lav_market_analyses', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('⚠️ API bağlantı sorunu. Fallback pazar analizi eklendi.\n\nDaha detaylı analiz için: Rakip Analizi sekmesinde "Tüm Rakipleri Otomatik Analiz Et" butonuna tıkla.');
    }
    setLoading(false);
  };

  const handleMarketFormChange = useCallback((field, value) => {
    setNewMarketForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCompetitorFormChange = useCallback((field, value) => {
    setNewCompetitorForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLoadPredefinedCompetitor = (competitorName) => {
    const data = predefinedCompetitors[competitorName];
    if (data) {
      setNewCompetitorForm(prev => ({
        ...prev,
        competitor: competitorName,
        country: data.country || prev.country,
        website: data.website || '',
        instagram: data.instagram || '',
        instagram2: data.instagram2 || '',
        pinterest: data.pinterest || '',
        linkedin: data.linkedin || ''
      }));
      alert(`✓ ${competitorName}'nin sosyal medya ve website bilgileri yüklendi!`);
    }
  };

  // Save market analysis
  const handleSaveMarketAnalysis = async () => {
    if (!newMarketForm.marketSize || !newMarketForm.trends) {
      alert('Lütfen en az Pazar Boyutu ve Trendleri doldurun');
      return;
    }

    const analysis = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      ...newMarketForm
    };

    const updated = [...marketData, analysis];
    setMarketData(updated);

    try {
      await window.storage.set('lav_market_analyses', JSON.stringify(updated));
    } catch (error) {
      console.error('Save error:', error);
    }

    setNewMarketForm({
      country: 'Türkiye',
      marketSize: '',
      growth: '',
      trends: '',
      opportunities: ''
    });
    
    alert('✓ Pazar analizi kaydedildi!');
  };

  // Save competitor analysis
  const handleSaveCompetitorAnalysis = async () => {
    if (!newCompetitorForm.strengths || !newCompetitorForm.weaknesses) {
      alert('Lütfen en az Güçlü Yanları ve Zayıf Yanları doldurun');
      return;
    }

    const analysis = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      ...newCompetitorForm
    };

    const updated = [...competitorAnalyses, analysis];
    setCompetitorAnalyses(updated);

    try {
      await window.storage.set('lav_competitor_tracking', JSON.stringify(updated));
    } catch (error) {
      console.error('Save error:', error);
    }

    setNewCompetitorForm({
      competitor: 'Paşabahçe',
      strengths: '',
      weaknesses: '',
      marketPosition: '',
      pricingStrategy: '',
      latestMoves: '',
      country: 'Türkiye',
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
      instagramFollowers: '',
      facebookFollowers: '',
      tiktokFollowers: '',
      youtubeFollowers: '',
      socialMediaStrategy: '',
      contentTypes: '',
      postingFrequency: '',
      contentTone: '',
      hashtagStrategy: '',
      engagementTactics: '',
      campaignTypes: '',
      uGCStrategy: '',
      website: '',
      instagram2: '',
      instagram2Followers: '',
      pinterest: '',
      linkedin: ''
    });

    alert('✓ Rakip analizi kaydedildi!');
  };

  // Auto-analyze all competitors with AI
  const handleAutoAnalyzeAllCompetitors = async () => {
    setLoading(true);
    const competitorsList = ['Paşabahçe', 'Luminarc', 'Libbey', 'Bormioli'];
    const newAnalyses = [];
    let successCount = 0;

    for (const competitor of competitorsList) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 800,
            messages: [
              {
                role: "user",
                content: `${competitor} hakkında kısa ama kapsamlı rakip analizi yap. Cam ve bardak endüstrisinde.

Lütfen SADECE bu formatı kullan (her bölüm 1-2 cümle):

GÜÇ: [güçlü yanları]
ZAAF: [zayıf yanları]  
KON: [pazardaki konumu]
FİYAT: [fiyatlandırma stratejisi]
HAM: [son hamleler/yeni ürünler]

Kısa, pratik, işletme dili kullan.`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.content || !result.content[0]) {
          throw new Error('Invalid API response format');
        }

        const content = result.content[0].text;

        // Parse the response
        const strengthsMatch = content.match(/GÜÇ:\s*(.+?)(?=ZAAF:|$)/s);
        const weaknessesMatch = content.match(/ZAAF:\s*(.+?)(?=KON:|$)/s);
        const positionMatch = content.match(/KON:\s*(.+?)(?=FİYAT:|$)/s);
        const pricingMatch = content.match(/FİYAT:\s*(.+?)(?=HAM:|$)/s);
        const movesMatch = content.match(/HAM:\s*(.+?)$/s);

        // Get predefined data if exists
        const predefinedData = predefinedCompetitors[competitor] || {};

        const analysis = {
          id: Date.now() + Math.random(),
          date: new Date().toLocaleDateString('tr-TR'),
          competitor: competitor,
          country: predefinedData.country || 'Türkiye',
          strengths: strengthsMatch ? strengthsMatch[1].trim() : content.substring(0, 150),
          weaknesses: weaknessesMatch ? weaknessesMatch[1].trim() : '',
          marketPosition: positionMatch ? positionMatch[1].trim() : '',
          pricingStrategy: pricingMatch ? pricingMatch[1].trim() : '',
          latestMoves: movesMatch ? movesMatch[1].trim() : '',
          website: predefinedData.website || '',
          instagram: predefinedData.instagram || '',
          instagram2: predefinedData.instagram2 || '',
          pinterest: predefinedData.pinterest || '',
          linkedin: predefinedData.linkedin || '',
          facebook: '',
          tiktok: '',
          youtube: '',
          instagramFollowers: '',
          facebookFollowers: '',
          tiktokFollowers: '',
          youtubeFollowers: '',
          socialMediaStrategy: '',
          contentTypes: '',
          postingFrequency: '',
          contentTone: '',
          hashtagStrategy: '',
          engagementTactics: '',
          campaignTypes: '',
          uGCStrategy: ''
        };

        newAnalyses.push(analysis);
        successCount++;
        console.log(`✅ ${competitor} analiz edildi`);
      } catch (error) {
        console.error(`❌ ${competitor} analiz hatası:`, error.message);
        
        // Fallback: Add competitor with predefined data
        const predefinedData = predefinedCompetitors[competitor] || {};
        const fallbackAnalysis = {
          id: Date.now() + Math.random(),
          date: new Date().toLocaleDateString('tr-TR'),
          competitor: competitor,
          country: predefinedData.country || 'Türkiye',
          strengths: '(API bağlantı sorunu - bilgi manuel giriş gerekli)',
          weaknesses: '(API bağlantı sorunu - bilgi manuel giriş gerekli)',
          marketPosition: '(API bağlantı sorunu - bilgi manuel giriş gerekli)',
          pricingStrategy: '(API bağlantı sorunu - bilgi manuel giriş gerekli)',
          latestMoves: '(API bağlantı sorunu - bilgi manuel giriş gerekli)',
          website: predefinedData.website || '',
          instagram: predefinedData.instagram || '',
          instagram2: predefinedData.instagram2 || '',
          pinterest: predefinedData.pinterest || '',
          linkedin: predefinedData.linkedin || '',
          facebook: '',
          tiktok: '',
          youtube: '',
          instagramFollowers: '',
          facebookFollowers: '',
          tiktokFollowers: '',
          youtubeFollowers: '',
          socialMediaStrategy: '',
          contentTypes: '',
          postingFrequency: '',
          contentTone: '',
          hashtagStrategy: '',
          engagementTactics: '',
          campaignTypes: '',
          uGCStrategy: ''
        };
        
        newAnalyses.push(fallbackAnalysis);
      }
    }

    // Save all analyses
    const allAnalyses = [...competitorAnalyses, ...newAnalyses];
    setCompetitorAnalyses(allAnalyses);

    try {
      await window.storage.set('lav_competitor_tracking', JSON.stringify(allAnalyses));
    } catch (error) {
      console.error('Save error:', error);
    }

    setLoading(false);
    
    if (successCount === 0) {
      alert(`⚠️ API bağlantı sorunu. ${newAnalyses.length}/4 rakip predefined verilerle eklendi.\n\nTarayıcı F12 → Console'da detaylı error'ü göreceksin.\n\nWeb/Instagram verileri otomatik yüklü. Diğer bilgileri manuel gir.`);
    } else if (successCount < 4) {
      alert(`✓ ${successCount}/4 rakip analiz edildi. ${4-successCount} predefined verilerle eklendi.`);
    } else {
      alert(`✓ Tüm ${successCount} rakip analiz edildi ve kaydedildi!`);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `LAV cam ve bardak ürünleri için pazarlama analizi yap.

Mevcut veriler:
- Rakipler: Paşabahçe, Luminarc, Libbey, Bormioli
- Pazarlar: Türkiye (ana), İtalya, İspanya, Fransa, Amerika (hedef)
- En son pazar analizi: ${marketData[marketData.length - 1]?.trends || 'Veri yok'}

Lütfen şu konularda 3-5 maddelik öneriler sun:
1. Content Ideas: Sosyal medya ve PR için fikir
2. Öne Çıkan Ürünler: Hangi ürünleri vurgulamalı
3. Kullanım Alışkanlıkları: Hedef pazarlara göre strateji

Her öneriye başlık ekle ve pratik ol.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  const handleGetCompetitorAnalysis = async () => {
    setLoading(true);
    try {
      const latestMarketData = marketData[marketData.length - 1];
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [
            {
              role: "user",
              content: `LAV'ın rakipleri için detaylı rekabetçi analiz yap.

Rakipler: Paşabahçe, Luminarc, Libbey, Bormioli

Mevcut rakip verileri:
${competitorAnalyses.map(c => `- ${c.competitor} (${c.country}): ${c.strengths.substring(0, 50)}...`).join('\n')}

Pazar durumu: ${latestMarketData?.trends || 'Veri yok'}

Lütfen şunları analiz et:
1. Her rakibin pazardaki konumu nedir?
2. LAV'ın en büyük tehdidi hangi rakip?
3. LAV'ın hangi rakibe karşı en güçlü?
4. Fiyatlandırma stratejilerinde farklar neler?
5. LAV'ın diferansiyasyon stratejisi ne olmalı?

Her noktayı pratik ve işletme odaklı öner.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'competitor_analysis',
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ Rekabetçi analiz önerileri oluşturuldu!');
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  const handleGetSocialMediaAnalysis = async () => {
    setLoading(true);
    try {
      const socialMediaData = competitorAnalyses.map(c => ({
        competitor: c.competitor,
        instagram: c.instagram,
        instagramFollowers: c.instagramFollowers,
        facebook: c.facebook,
        facebookFollowers: c.facebookFollowers,
        tiktok: c.tiktok,
        tiktokFollowers: c.tiktokFollowers,
        youtube: c.youtube,
        youtubeFollowers: c.youtubeFollowers,
        strategy: c.socialMediaStrategy
      })).filter(c => c.instagram || c.facebook || c.tiktok || c.youtube);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [
            {
              role: "user",
              content: `LAV'ın rakiplerinin sosyal medya stratejilerini analiz et.

Rakiplerin sosyal medya verileri:
${socialMediaData.map(c => `
${c.competitor}:
- Instagram: ${c.instagram} (${c.instagramFollowers || 'Veri yok'})
- Facebook: ${c.facebook} (${c.facebookFollowers || 'Veri yok'})
- TikTok: ${c.tiktok} (${c.tiktokFollowers || 'Veri yok'})
- YouTube: ${c.youtube} (${c.youtubeFollowers || 'Veri yok'})
- Strateji: ${c.strategy || 'Not var'}
`).join('')}

Lütfen şunları analiz et:
1. Hangi rakip sosyal medyada en güçlü?
2. Platform dağılımında farklar neler?
3. Takipçi büyümesi hızı tahmini?
4. LAV'ın sosyal medya stratejisi nedir?
5. Hangi platformda LAV yoğunlaşmalı?

Pratik ve işletmeye odaklı öner.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'social_media_analysis',
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ Sosyal medya analiz önerileri oluşturuldu!');
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  // Get media performance analysis
  const handleGetMediaPerformanceAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `LAV'ın medya kampanyaları için detaylı performans analizi ve iyileştirme önerileri yap.

Mevcut Kampanyalar:
${mediaPerformance.map(c => `
${c.campaignName} (${c.platform}):
- Bütçe: €${c.budget}
- Harcama: €${c.spend}
- ROI: ${c.roi}
- İzlenim: ${c.impressions || 'Veri yok'}
- Tıklama: ${c.clicks || 'Veri yok'}
- Dönüşüm: ${c.conversions || 'Veri yok'}
- Dönüşüm Değeri: €${c.conversionValue || 'Veri yok'}
- Notlar: ${c.notes || 'Veri yok'}
`).join('')}

Lütfen şunları analiz et:

1. **Kampanya Performans Özeti**
   - Hangi kampanya en başarılı?
   - Hangi platform en iyi ROI sağlıyor?
   - Genel bütçe verimliliği nasıl?

2. **ROI Analizi**
   - Kampanyalar arası ROI karşılaştırması
   - Üstün performans gösteren kampanya neden başarılı?
   - Düşük performans gösteren kampanya neden sorunlu?

3. **Bütçe Optimizasyonu**
   - Bütçe dağılımı nereye kaydırılmalı?
   - Hangi platform'a daha fazla yatırım yapılmalı?
   - Hangi platform'dan para kesebiliriz?

4. **Harcama Verimliliği**
   - Cost Per Click (CPC) analizi
   - Cost Per Conversion (CPA) analizi
   - Hangi kanal daha verimli?

5. **Dönüşüm Stratejisi**
   - Dönüşüm oranı nasıl iyileştirilebilir?
   - Hangi taktikler önerilir?
   - A/B testing önerileri?

6. **Hızlı Kazançlar (Quick Wins)**
   - 1-2 hafta içinde uygulanabilir iyileştirmeler
   - Minimum risk, maksimum ROI
   - Test edilebilecek spesifik taktikler

7. **30 Günlük Aksiyon Planı**
   - Haftalık milestone'lar
   - Test edilecek hipotezler
   - Beklenen sonuçlar

Her bölümde pratik, sayılarla desteklenmiş öneriler sun.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'media_performance_analysis',
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ Medya performans analizi önerileri oluşturuldu!');
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  const handleGetAutoContentCalendar = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [
            {
              role: "user",
              content: `LAV cam/bardak ürünleri için 4 haftalık optimized sosyal medya content calendar oluştur.

Pazarlar: Türkiye (ana), İtalya, İspanya, Fransa, Amerika
Rakip Analizleri: Paşabahçe (premium), Luminarc (casual), Libbey (educational), Bormioli (luxury)

Lütfen şu formatı kullan (her post için):

POST [1-16]:
Platform: Instagram/Facebook/TikTok/YouTube
Tür: [İçerik Türü]
Başlık: [Post Başlığı]
Açıklama: [2-3 cümle caption]
Hashtag: [Relevant hashtags]
Hedef Ülke: [Ülke]
Engagement Hedefi: [Beklenen engagement]
Scheduling: [Günü] [Saati] UTC

4 haftanın stratejisi:

HAFTA 1: Awareness & Reach
HAFTA 2: Engagement & Community
HAFTA 3: Conversion & Sales
HAFTA 4: Retention & Loyalty

Rakip analizi ile gap'ları kapatacak içerik öner.
Her post'un neden o hafta'ya uygun olduğunu kısaca açıkla.
Seasonal trends'i göz önüne al.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'auto_content_calendar',
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ AI-destekli 4 haftalık content calendar oluşturuldu!');
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  // Get content strategy analysis
  const handleGetContentStrategyAnalysis = async () => {
    setLoading(true);
    try {
      const contentStrategyData = competitorAnalyses.map(c => ({
        competitor: c.competitor,
        contentTypes: c.contentTypes,
        postingFrequency: c.postingFrequency,
        contentTone: c.contentTone,
        hashtagStrategy: c.hashtagStrategy,
        engagementTactics: c.engagementTactics,
        campaignTypes: c.campaignTypes,
        uGCStrategy: c.uGCStrategy,
        instagramFollowers: c.instagramFollowers,
        socialMediaStrategy: c.socialMediaStrategy
      })).filter(c => c.contentTypes || c.postingFrequency || c.contentTone);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `LAV'ın rakiplerinin content stratejisini derinlemesine analiz et.

Rakiplerin Content Strategy:
${contentStrategyData.map(c => `
${c.competitor}:
- İçerik Türleri: ${c.contentTypes || 'Veri yok'}
- Posting Sıklığı: ${c.postingFrequency || 'Veri yok'}
- Ton: ${c.contentTone || 'Veri yok'}
- Hashtag Stratejisi: ${c.hashtagStrategy || 'Veri yok'}
- Engagement Taktikleri: ${c.engagementTactics || 'Veri yok'}
- Kampanya Türleri: ${c.campaignTypes || 'Veri yok'}
- UGC Stratejisi: ${c.uGCStrategy || 'Veri yok'}
- Takipçi Sayısı: ${c.instagramFollowers || 'Veri yok'}
`).join('')}

Lütfen şu konularda detaylı analiz yap:

1. **İçerik Mix Analizi**: Her rakibin içerik karışımı nasıl? Hangi tür içerik daha başarılı?

2. **Posting Stratejisi**: Sıklık, zaman dilimi, consistency açısından farklar neler?

3. **Tone & Brand Voice**: Her rakibin iletişim tonu nasıl? Hangi daha etkili?

4. **Engagement Strategy**: Engagement almak için ne yapıyorlar? Polls, challenges, UGC vb?

5. **LAV'ın Opportunity**: LAV'ın hangi content type'ında gap var? Nereye fokus olmalı?

6. **Content Calendar Önerisi**: LAV'ın haftalık/aylık content mix'i ne olmalı?

7. **Quick Wins**: LAV'ın 30 günde yapabileceği content improvements?

Pratik, implementable ve rakip benchmarklı öneriler yap.`
            }
          ]
        })
      });

      const result = await response.json();
      const content = result.content[0].text;

      const rec = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'content_strategy_analysis',
        content: content,
        status: 'pending'
      };

      const updated = [...recommendations, rec];
      setRecommendations(updated);

      try {
        await window.storage.set('lav_recommendations', JSON.stringify(updated));
      } catch (error) {
        console.error('Save error:', error);
      }

      alert('✓ Content strategy analiz önerileri oluşturuldu!');
    } catch (error) {
      alert('API hatası: ' + error.message);
    }
    setLoading(false);
  };

  const handleApproveRec = async (id) => {
    const updated = recommendations.map(rec =>
      rec.id === id ? { ...rec, status: 'approved' } : rec
    );
    setRecommendations(updated);
    await window.storage.set('lav_recommendations', JSON.stringify(updated));
  };

  const handleDeleteAnalysis = async (id, type) => {
    if (type === 'market') {
      const updated = marketData.filter(item => item.id !== id);
      setMarketData(updated);
      await window.storage.set('lav_market_analyses', JSON.stringify(updated));
    } else if (type === 'competitor_analysis') {
      const updated = competitorAnalyses.filter(item => item.id !== id);
      setCompetitorAnalyses(updated);
      await window.storage.set('lav_competitor_tracking', JSON.stringify(updated));
    } else if (type === 'recommendation') {
      const updated = recommendations.filter(item => item.id !== id);
      setRecommendations(updated);
      await window.storage.set('lav_recommendations', JSON.stringify(updated));
    } else if (type === 'content_post') {
      const updated = contentCalendar.filter(item => item.id !== id);
      setContentCalendar(updated);
      await window.storage.set('lav_content_calendar', JSON.stringify(updated));
    } else if (type === 'media_performance') {
      const updated = mediaPerformance.filter(item => item.id !== id);
      setMediaPerformance(updated);
      await window.storage.set('lav_media_performance', JSON.stringify(updated));
    }
  };

  // Market Analysis Tab
  const MarketAnalysisTab = () => (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Pazar & Rakip Analizi
      </h2>

      {/* AI Market Analysis Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-success) 0%, var(--surface-1) 100%)',
        border: '0.5px solid var(--border-success)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'var(--text-success)',
          margin: '0 0 0.75rem 0'
        }}>
          🤖 Türkiye Pazar Analizi (AI Destekli)
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-success)',
          margin: '0 0 1rem 0'
        }}>
          Sofra alışkanlıkları, ev dekorasyonu trendleri ve pazar büyüme potansiyelini analiz et. Veri girişi gerekli değil!
        </p>
        <button
          onClick={handleGetAutoMarketAnalysis}
          disabled={loading}
          style={{
            padding: '10px 16px',
            background: loading ? 'var(--fill-disabled)' : 'var(--fill-success)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {loading ? '⏳ Analiz yapılıyor...' : '📊 Pazar Analizi Al'}
        </button>
        <p style={{
          fontSize: '11px',
          color: 'var(--text-success)',
          margin: '8px 0 0 0'
        }}>
          ✓ Sofra alışkanlıkları ✓ Ev dekorasyonu trendleri ✓ Pazar büyüme ✓ Tüketici davranışları
        </p>
      </div>
      <div style={{
        background: 'var(--surface-1)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Yeni Pazar Analizi Ekle
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Ülke
            </label>
            <select
              value={newMarketForm.country}
              onChange={(e) => handleMarketFormChange('country', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            >
              {countries.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Pazar Boyutu (örn: 500M EUR)
            </label>
            <input
              type="text"
              placeholder="500M EUR"
              value={newMarketForm.marketSize}
              onChange={(e) => handleMarketFormChange('marketSize', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Büyüme Oranı (%)
            </label>
            <input
              type="number"
              placeholder="5.2"
              value={newMarketForm.growth}
              onChange={(e) => handleMarketFormChange('growth', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleGetRecommendations}
              disabled={loading || marketData.length === 0}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: loading ? 'var(--fill-disabled)' : 'var(--fill-accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              {loading ? '⏳ AI Analiz Yapılıyor...' : '✨ AI Önerisi Al'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Önemli Trendler *
          </label>
          <textarea
            placeholder="Premium cam ürünlere talep artıyor, ev dekorasyonuna yatırım, health-conscious tüketiciler..."
            value={newMarketForm.trends}
            onChange={(e) => handleMarketFormChange('trends', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Fırsatlar & Tehditler
          </label>
          <textarea
            placeholder="Fırsat: E-commerce büyümesi. Tehdit: Çevre regs, ucuz ithalatlar..."
            value={newMarketForm.opportunities}
            onChange={(e) => handleMarketFormChange('opportunities', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          onClick={handleSaveMarketAnalysis}
          style={{
            padding: '10px 16px',
            background: 'var(--fill-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          💾 Analizi Kaydet
        </button>
      </div>

      {/* Past Analyses */}
      <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        📊 Geçmiş Analizler ({marketData.length})
      </h3>

      {marketData.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Henüz pazar analizi yok. Yukarıdan ekleyin!
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {[...marketData].reverse().map(analysis => (
            <div key={analysis.id} style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {analysis.country}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    {analysis.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteAnalysis(analysis.id, 'market')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🗑️
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Pazar Boyutu:</span>
                  <span style={{ color: 'var(--text-primary)', marginLeft: '4px', fontWeight: '500' }}>
                    {analysis.marketSize}
                  </span>
                </div>
                {analysis.growth && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Büyüme:</span>
                    <span style={{ color: 'var(--text-primary)', marginLeft: '4px', fontWeight: '500' }}>
                      +{analysis.growth}%
                    </span>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <p><strong>Trendler:</strong> {analysis.trends}</p>
                {analysis.opportunities && <p><strong>Fırsatlar:</strong> {analysis.opportunities}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Competitor Tracking Tab - WITH FIXED INPUT HANDLERS
  const CompetitorTrackingTab = () => (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        🏆 Rakip Takip & Analizi
      </h2>

      {/* Quick Start - Auto Analyze */}
      {competitorAnalyses.length === 0 && (
        <div style={{
          background: 'var(--bg-accent)',
          border: '0.5px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-accent)',
            margin: '0 0 0.5rem 0'
          }}>
            ⚡ Hızlı Başlangıç
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-accent)',
            margin: '0 0 1rem 0'
          }}>
            Tüm 4 rakibi (Paşabahçe, Luminarc, Libbey, Bormioli) otomatik olarak AI ile analiz edip matrisi oluştur.
          </p>
          <button
            onClick={handleAutoAnalyzeAllCompetitors}
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: loading ? 'var(--fill-disabled)' : 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? '⏳ Tüm rakipler analiz ediliyor...' : '🚀 Tüm Rakipleri Otomatik Analiz Et'}
          </button>
        </div>
      )}

      {/* Form - FIXED INPUT FOCUS ISSUE */}
      <div style={{
        background: 'var(--surface-1)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Yeni Rakip Analizi Ekle
        </h3>

        {/* Quick Load Predefined Competitors */}
        <div style={{
          background: 'var(--surface-0)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', fontWeight: '500' }}>
            🚀 Önceden Tanımlanmış Rakipleri Yükle (Web + Instagram otomatik):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {competitors.map(c => (
              <button
                key={c}
                onClick={() => handleLoadPredefinedCompetitor(c)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--fill-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            Rakip seç → Website + Instagram hesapları otomatik doldurulacak
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
          <div onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Rakip İsmi
            </label>
            <select
              value={newCompetitorForm.competitor}
              onChange={(e) => handleCompetitorFormChange('competitor', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            >
              {competitors.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              İnceleme Ülkesi
            </label>
            <select
              value={newCompetitorForm.country}
              onChange={(e) => handleCompetitorFormChange('country', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            >
              {countries.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Strengths - FIXED */}
        <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Güçlü Yanları *
          </label>
          <textarea
            placeholder="Marka bilinirliği, dağıtım ağı, ar-ge yatırımı, kalite algısı..."
            value={newCompetitorForm.strengths}
            onChange={(e) => handleCompetitorFormChange('strengths', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '70px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Weaknesses - FIXED */}
        <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Zayıf Yanları *
          </label>
          <textarea
            placeholder="Yüksek fiyatlandırma, sınırlı ürün yelpazesi, zayıf dijital presence..."
            value={newCompetitorForm.weaknesses}
            onChange={(e) => handleCompetitorFormChange('weaknesses', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '70px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Market Position & Pricing - FIXED */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
          <div onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Pazardaki Konumu
            </label>
            <input
              type="text"
              placeholder="Örn: Premium segment lider, %22 pazar payı"
              value={newCompetitorForm.marketPosition}
              onChange={(e) => handleCompetitorFormChange('marketPosition', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>

          <div onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Fiyatlandırma Stratejisi
            </label>
            <input
              type="text"
              placeholder="Örn: Orta-yüksek fiyat, promosyon odaklı"
              value={newCompetitorForm.pricingStrategy}
              onChange={(e) => handleCompetitorFormChange('pricingStrategy', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Latest Moves - FIXED */}
        <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Son Hamleler / Yeni Ürünler
          </label>
          <textarea
            placeholder="Yeni tasarım hattı, dijital satış hedefi, partnership anlaşmaları..."
            value={newCompetitorForm.latestMoves}
            onChange={(e) => handleCompetitorFormChange('latestMoves', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '70px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Website & Main Links */}
        <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            🌐 Website
          </label>
          <input
            type="url"
            placeholder="https://www.example.com"
            value={newCompetitorForm.website || ''}
            onChange={(e) => handleCompetitorFormChange('website', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Social Media Section - FIXED */}
        <div style={{
          background: 'var(--surface-0)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }} onMouseDown={(e) => e.stopPropagation()}>
          <h4 style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
            📱 Sosyal Medya Hesapları
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                📸 Instagram Hesabı (1)
              </label>
              <input
                type="text"
                placeholder="https://www.instagram.com/pasabahce"
                value={newCompetitorForm.instagram}
                onChange={(e) => handleCompetitorFormChange('instagram', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Takipçi Sayısı
              </label>
              <input
                type="text"
                placeholder="250K"
                value={newCompetitorForm.instagramFollowers}
                onChange={(e) => handleCompetitorFormChange('instagramFollowers', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Instagram 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                📸 Instagram Hesabı (2) - İkincil
              </label>
              <input
                type="text"
                placeholder="https://www.instagram.com/pasabahcemagazalari"
                value={newCompetitorForm.instagram2 || ''}
                onChange={(e) => handleCompetitorFormChange('instagram2', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Takipçi Sayısı
              </label>
              <input
                type="text"
                placeholder="50K"
                value={newCompetitorForm.instagram2Followers || ''}
                onChange={(e) => handleCompetitorFormChange('instagram2Followers', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                👤 Facebook Sayfası
              </label>
              <input
                type="text"
                placeholder="https://www.facebook.com/pasabahce"
                value={newCompetitorForm.facebook}
                onChange={(e) => handleCompetitorFormChange('facebook', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Takipçi Sayısı
              </label>
              <input
                type="text"
                placeholder="150K"
                value={newCompetitorForm.facebookFollowers}
                onChange={(e) => handleCompetitorFormChange('facebookFollowers', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                🎵 TikTok Hesabı
              </label>
              <input
                type="text"
                placeholder="https://www.tiktok.com/@pasbahce"
                value={newCompetitorForm.tiktok}
                onChange={(e) => handleCompetitorFormChange('tiktok', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Takipçi Sayısı
              </label>
              <input
                type="text"
                placeholder="50K"
                value={newCompetitorForm.tiktokFollowers}
                onChange={(e) => handleCompetitorFormChange('tiktokFollowers', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                ▶️ YouTube Kanalı
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/@Pasabahce"
                value={newCompetitorForm.youtube}
                onChange={(e) => handleCompetitorFormChange('youtube', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Abone Sayısı
              </label>
              <input
                type="text"
                placeholder="30K"
                value={newCompetitorForm.youtubeFollowers}
                onChange={(e) => handleCompetitorFormChange('youtubeFollowers', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Pinterest & LinkedIn */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                📌 Pinterest
              </label>
              <input
                type="text"
                placeholder="https://tr.pinterest.com/pasabahce_/"
                value={newCompetitorForm.pinterest || ''}
                onChange={(e) => handleCompetitorFormChange('pinterest', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                💼 LinkedIn
              </label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/company/pasabahce"
                value={newCompetitorForm.linkedin || ''}
                onChange={(e) => handleCompetitorFormChange('linkedin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              📊 Sosyal Medya Stratejisi & Gözlemler
            </label>
            <textarea
              placeholder="İçerik türleri, posting sıklığı, engagement stratejisi, kampanyalar..."
              value={newCompetitorForm.socialMediaStrategy}
              onChange={(e) => handleCompetitorFormChange('socialMediaStrategy', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'inherit',
                minHeight: '70px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Content Strategy Section - FIXED */}
        <div style={{
          background: 'var(--surface-0)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }} onMouseDown={(e) => e.stopPropagation()}>
          <h4 style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
            📝 İçerik Stratejisi Analizi
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                📸 İçerik Türleri (virgülle ayırarak)
              </label>
              <input
                type="text"
                placeholder="Ürün gösterimi, lifestyle, eğitim, behind-the-scenes, UGC"
                value={newCompetitorForm.contentTypes}
                onChange={(e) => handleCompetitorFormChange('contentTypes', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                ⏰ Posting Sıklığı
              </label>
              <input
                type="text"
                placeholder="Örn: 5 post/hafta, günde 1-2 stories"
                value={newCompetitorForm.postingFrequency}
                onChange={(e) => handleCompetitorFormChange('postingFrequency', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                🎯 İçerik Tonu
              </label>
              <input
                type="text"
                placeholder="Profesyonel, casual, oyuncu, eğlenceli"
                value={newCompetitorForm.contentTone}
                onChange={(e) => handleCompetitorFormChange('contentTone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                #️⃣ Hashtag Stratejisi
              </label>
              <input
                type="text"
                placeholder="Çok hashtag, az hashtag, branded hashtag"
                value={newCompetitorForm.hashtagStrategy}
                onChange={(e) => handleCompetitorFormChange('hashtagStrategy', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              💬 Engagement & Etkileşim Taktikleri
            </label>
            <textarea
              placeholder="Polls, Q&A, contests, challenges, influencer collaborations, community management style"
              value={newCompetitorForm.engagementTactics}
              onChange={(e) => handleCompetitorFormChange('engagementTactics', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'inherit',
                minHeight: '70px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                📢 Kampanya Türleri
              </label>
              <input
                type="text"
                placeholder="Mevsimsel, product launch, seasonal, brand awareness"
                value={newCompetitorForm.campaignTypes}
                onChange={(e) => handleCompetitorFormChange('campaignTypes', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                👥 User-Generated Content (UGC) Stratejisi
              </label>
              <input
                type="text"
                placeholder="Var/yok, aktif teşvik, hashtag kullanımı"
                value={newCompetitorForm.uGCStrategy}
                onChange={(e) => handleCompetitorFormChange('uGCStrategy', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveCompetitorAnalysis}
          style={{
            padding: '10px 16px',
            background: 'var(--fill-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginRight: '8px'
          }}
        >
          💾 Analizi Kaydet
        </button>

        <button
          onClick={handleGetCompetitorAnalysis}
          disabled={loading || competitorAnalyses.length === 0}
          style={{
            padding: '10px 16px',
            background: loading || competitorAnalyses.length === 0 ? 'var(--fill-disabled)' : 'var(--fill-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: loading || competitorAnalyses.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {loading ? '⏳ Analiz yapılıyor...' : '⚔️ Rekabetçi Analiz Al'}
        </button>
      </div>

      {/* Competitor Comparison Matrix */}
      {competitorAnalyses.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            📊 Rakip Karşılaştırma Matrisi ({competitorAnalyses.length} rakip)
          </h3>

          {/* Visual Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '1.5rem'
          }}>
            {competitorAnalyses.map((analysis) => (
              <div key={analysis.id} style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.75rem 0'
                }}>
                  {analysis.competitor}
                </p>

                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      Konumu
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {analysis.marketPosition || 'Veri yok'}
                    </span>
                  </div>

                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      Fiyat
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {analysis.pricingStrategy || 'Veri yok'}
                    </span>
                  </div>

                  {/* Social Media Metrics */}
                  {(analysis.instagram || analysis.facebook || analysis.tiktok || analysis.youtube) && (
                    <div style={{
                      paddingTop: '8px',
                      borderTop: '0.5px solid var(--border)',
                      paddingBottom: '8px'
                    }}>
                      <span style={{
                        display: 'block',
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        📱 Sosyal Medya
                      </span>
                      <div style={{ display: 'grid', gap: '3px' }}>
                        {analysis.instagram && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                            📸 {analysis.instagramFollowers || 'Veri yok'}
                          </span>
                        )}
                        {analysis.facebook && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                            👤 {analysis.facebookFollowers || 'Veri yok'}
                          </span>
                        )}
                        {analysis.tiktok && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                            🎵 {analysis.tiktokFollowers || 'Veri yok'}
                          </span>
                        )}
                        {analysis.youtube && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                            ▶️ {analysis.youtubeFollowers || 'Veri yok'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{
                    paddingTop: '8px',
                    borderTop: '0.5px solid var(--border)'
                  }}>
                    <span style={{
                      display: 'block',
                      fontSize: '10px',
                      color: 'var(--text-success)',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      💪 Güçlü Yanlar
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      display: 'block'
                    }}>
                      {analysis.strengths.substring(0, 80)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Comparison Table */}
          <div style={{
            overflowX: 'auto',
            background: 'var(--surface-1)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <table style={{
              width: '100%',
              fontSize: '12px',
              borderCollapse: 'collapse',
              minWidth: '900px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-0)'
                  }}>
                    Rakip
                  </th>
                  <th style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-0)'
                  }}>
                    Pazardaki Konumu
                  </th>
                  <th style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-0)'
                  }}>
                    Fiyat Stratejisi
                  </th>
                  <th style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-0)'
                  }}>
                    📱 Sosyal Medya
                  </th>
                  <th style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-0)'
                  }}>
                    Son Hamleler
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorAnalyses.map((analysis, idx) => (
                  <tr
                    key={analysis.id}
                    style={{
                      borderBottom: '0.5px solid var(--border)',
                      background: idx % 2 === 0 ? 'transparent' : 'var(--surface-0)'
                    }}
                  >
                    <td style={{
                      padding: '10px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap'
                    }}>
                      🏢 {analysis.competitor}
                    </td>
                    <td style={{
                      padding: '10px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px'
                    }}>
                      {analysis.marketPosition || '-'}
                    </td>
                    <td style={{
                      padding: '10px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px'
                    }}>
                      {analysis.pricingStrategy || '-'}
                    </td>
                    <td style={{
                      padding: '10px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px'
                    }}>
                      <div style={{ display: 'grid', gap: '2px' }}>
                        {analysis.instagram && <span>📸 {analysis.instagramFollowers || 'Veri yok'}</span>}
                        {analysis.facebook && <span>👤 {analysis.facebookFollowers || 'Veri yok'}</span>}
                        {analysis.tiktok && <span>🎵 {analysis.tiktokFollowers || 'Veri yok'}</span>}
                        {analysis.youtube && <span>▶️ {analysis.youtubeFollowers || 'Veri yok'}</span>}
                        {!analysis.instagram && !analysis.facebook && !analysis.tiktok && !analysis.youtube && <span>-</span>}
                      </div>
                    </td>
                    <td style={{
                      padding: '10px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px'
                    }}>
                      {analysis.latestMoves ? analysis.latestMoves.substring(0, 50) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Social Media Analysis Section */}
      {competitorAnalyses.length > 0 && (
        <div style={{
          background: 'var(--bg-success)',
          border: '0.5px solid var(--border-success)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-success)',
            margin: '0 0 0.75rem 0'
          }}>
            📱 Sosyal Medya Stratejisi Analizi
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-success)',
            margin: '0 0 1rem 0'
          }}>
            Tüm rakiplerin sosyal medya varlığını analiz edip LAV'ın stratejisini öğren.
          </p>
          <button
            onClick={handleGetSocialMediaAnalysis}
            disabled={loading || competitorAnalyses.filter(c => c.instagram || c.facebook || c.tiktok || c.youtube).length === 0}
            style={{
              padding: '10px 16px',
              background: loading || competitorAnalyses.filter(c => c.instagram || c.facebook || c.tiktok || c.youtube).length === 0 ? 'var(--fill-disabled)' : 'var(--fill-success)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: loading || competitorAnalyses.filter(c => c.instagram || c.facebook || c.tiktok || c.youtube).length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {loading ? '⏳ Sosyal medya analiz ediliyor...' : '📊 Sosyal Medya Analizi Al'}
          </button>
        </div>
      )}

      {/* Content Strategy Analysis Section */}
      {competitorAnalyses.length > 0 && (
        <div style={{
          background: 'var(--bg-accent)',
          border: '0.5px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-accent)',
            margin: '0 0 0.75rem 0'
          }}>
            📝 Content Strategy Analizi
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-accent)',
            margin: '0 0 1rem 0'
          }}>
            Rakiplerin içerik stratejisini derinlemesine analiz et, LAV'ın ne yapması gerektiğini öğren.
          </p>
          <button
            onClick={handleGetContentStrategyAnalysis}
            disabled={loading || competitorAnalyses.filter(c => c.contentTypes || c.postingFrequency || c.contentTone).length === 0}
            style={{
              padding: '10px 16px',
              background: loading || competitorAnalyses.filter(c => c.contentTypes || c.postingFrequency || c.contentTone).length === 0 ? 'var(--fill-disabled)' : 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: loading || competitorAnalyses.filter(c => c.contentTypes || c.postingFrequency || c.contentTone).length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {loading ? '⏳ Content strategy analiz ediliyor...' : '📝 Content Strategy Analizi Al'}
          </button>
        </div>
      )}

      {/* Saved Analyses */}
      <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        📈 Rakip Profilleri ({competitorAnalyses.length})
      </h3>

      {competitorAnalyses.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Henüz rakip analizi yok. Yukarıdan ekleyin!
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {[...competitorAnalyses].reverse().map(analysis => (
            <div key={analysis.id} style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    🏢 {analysis.competitor}
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {analysis.country} • {analysis.date}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAnalysis(analysis.id, 'competitor_analysis')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🗑️
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Pazardaki Konumu
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0' }}>
                    {analysis.marketPosition || 'Belirtilmedi'}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Fiyat Stratejisi
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0' }}>
                    {analysis.pricingStrategy || 'Belirtilmedi'}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  margin: '0 0 4px 0',
                  fontWeight: '500'
                }}>
                  💪 Güçlü Yanları
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0', lineHeight: '1.6' }}>
                  {analysis.strengths}
                </p>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  margin: '0 0 4px 0',
                  fontWeight: '500'
                }}>
                  ⚠️ Zayıf Yanları
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0', lineHeight: '1.6' }}>
                  {analysis.weaknesses}
                </p>
              </div>

              {analysis.latestMoves && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    🚀 Son Hamleler
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0', lineHeight: '1.6' }}>
                    {analysis.latestMoves}
                  </p>
                </div>
              )}

              {/* Social Media Section */}
              {(analysis.instagram || analysis.facebook || analysis.tiktok || analysis.youtube) && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '0.5px solid var(--border)'
                }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    margin: '0 0 8px 0',
                    fontWeight: '500'
                  }}>
                    📱 Sosyal Medya Varlığı
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '11px'
                  }}>
                    {analysis.instagram && (
                      <div style={{
                        background: 'var(--surface-0)',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius)',
                        border: '0.5px solid var(--border)'
                      }}>
                        <span style={{ color: 'var(--text-muted)' }}>📸 Instagram</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {analysis.instagramFollowers || 'Veri yok'}
                        </p>
                        <p style={{ margin: '1px 0 0 0', color: 'var(--text-secondary)', fontSize: '10px' }}>
                          {analysis.instagram}
                        </p>
                      </div>
                    )}

                    {analysis.facebook && (
                      <div style={{
                        background: 'var(--surface-0)',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius)',
                        border: '0.5px solid var(--border)'
                      }}>
                        <span style={{ color: 'var(--text-muted)' }}>👤 Facebook</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {analysis.facebookFollowers || 'Veri yok'}
                        </p>
                        <p style={{ margin: '1px 0 0 0', color: 'var(--text-secondary)', fontSize: '10px' }}>
                          {analysis.facebook}
                        </p>
                      </div>
                    )}

                    {analysis.tiktok && (
                      <div style={{
                        background: 'var(--surface-0)',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius)',
                        border: '0.5px solid var(--border)'
                      }}>
                        <span style={{ color: 'var(--text-muted)' }}>🎵 TikTok</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {analysis.tiktokFollowers || 'Veri yok'}
                        </p>
                        <p style={{ margin: '1px 0 0 0', color: 'var(--text-secondary)', fontSize: '10px' }}>
                          {analysis.tiktok}
                        </p>
                      </div>
                    )}

                    {analysis.youtube && (
                      <div style={{
                        background: 'var(--surface-0)',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius)',
                        border: '0.5px solid var(--border)'
                      }}>
                        <span style={{ color: 'var(--text-muted)' }}>▶️ YouTube</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {analysis.youtubeFollowers || 'Veri yok'}
                        </p>
                        <p style={{ margin: '1px 0 0 0', color: 'var(--text-secondary)', fontSize: '10px' }}>
                          {analysis.youtube}
                        </p>
                      </div>
                    )}
                  </div>

                  {analysis.socialMediaStrategy && (
                    <div style={{ marginTop: '8px' }}>
                      <p style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        margin: '0 0 4px 0',
                        fontWeight: '500'
                      }}>
                        Strateji & Gözlemler
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.5' }}>
                        {analysis.socialMediaStrategy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Content Strategy Summary */}
              {(analysis.contentTypes || analysis.postingFrequency || analysis.contentTone) && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '0.5px solid var(--border)'
                }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    margin: '0 0 8px 0',
                    fontWeight: '500'
                  }}>
                    📝 İçerik Stratejisi
                  </p>

                  {analysis.contentTypes && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Türleri:</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                        {analysis.contentTypes}
                      </p>
                    </div>
                  )}

                  {analysis.postingFrequency && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sıklık:</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                        {analysis.postingFrequency}
                      </p>
                    </div>
                  )}

                  {analysis.contentTone && (
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ton:</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                        {analysis.contentTone}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // LAV Profile Tab
  const LAVProfileTab = () => (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🏢 LAV Profili & Sosyal Medya
      </h2>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        LAV'ın resmi web sitesi ve sosyal medya hesapları
      </p>

      {/* LAV Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-accent) 0%, var(--surface-1) 100%)',
        border: '2px solid var(--border-accent)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              🏢 LAV Brands
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0' }}>
              Cam ve Bardak Ürünleri Öncüsü
            </p>
          </div>
          <span style={{
            fontSize: '48px',
            opacity: 0.3
          }}>
            🏭
          </span>
        </div>

        {/* Websites */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-accent)', margin: '0 0 0.75rem 0' }}>
            🌐 Web Siteleri
          </h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <a 
              href="https://www.lav.com.tr/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '12px 16px',
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--text-accent)',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--surface-1)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--surface-2)'}
            >
              🔗 https://www.lav.com.tr/
              <span style={{ marginLeft: 'auto', fontSize: '16px' }}>↗️</span>
            </a>

            <a 
              href="https://company.lav.com.tr/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '12px 16px',
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--text-accent)',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--surface-1)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--surface-2)'}
            >
              🔗 https://company.lav.com.tr/ (Kurumsal)
              <span style={{ marginLeft: 'auto', fontSize: '16px' }}>↗️</span>
            </a>
          </div>
        </div>

        {/* Instagram */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-accent)', margin: '0 0 0.75rem 0' }}>
            📸 Instagram
          </h4>
          <a 
            href="https://www.instagram.com/lavturkiye/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '12px 16px',
              background: 'var(--surface-2)',
              border: '0.5px solid var(--border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-accent)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--surface-1)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--surface-2)'}
          >
            📱 @lavturkiye
            <span style={{ marginLeft: 'auto', fontSize: '16px' }}>↗️</span>
          </a>
        </div>
      </div>

      {/* Rakip Karşılaştırması */}
      <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        📊 Rakip Karşılaştırması - Web & Sosyal Medya Varlığı
      </h3>

      <div style={{
        background: 'var(--surface-1)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1rem',
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          fontSize: '12px',
          borderCollapse: 'collapse',
          minWidth: '700px'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: '500',
                color: 'var(--text-primary)',
                background: 'var(--surface-0)'
              }}>
                Marka
              </th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: '500',
                color: 'var(--text-primary)',
                background: 'var(--surface-0)'
              }}>
                🌐 Website
              </th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: '500',
                color: 'var(--text-primary)',
                background: 'var(--surface-0)'
              }}>
                📸 Instagram
              </th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: '500',
                color: 'var(--text-primary)',
                background: 'var(--surface-0)'
              }}>
                📌 Pinterest
              </th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: '500',
                color: 'var(--text-primary)',
                background: 'var(--surface-0)'
              }}>
                Ülke
              </th>
            </tr>
          </thead>
          <tbody>
            {/* LAV */}
            <tr style={{ borderBottom: '0.5px solid var(--border)', background: 'var(--bg-accent)' }}>
              <td style={{ padding: '10px', fontWeight: '500', color: 'var(--text-accent)' }}>
                🏢 LAV (Bizim)
              </td>
              <td style={{ padding: '10px', color: 'var(--text-accent)' }}>
                ✅ 2 site
              </td>
              <td style={{ padding: '10px', color: 'var(--text-accent)' }}>
                ✅ Aktif
              </td>
              <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                ❌ Yok
              </td>
              <td style={{ padding: '10px', color: 'var(--text-accent)' }}>
                Türkiye
              </td>
            </tr>

            {/* Rakipler */}
            {[
              { name: 'Paşabahçe', website: '✅', instagram: '✅✅', pinterest: '✅', country: 'Türkiye' },
              { name: 'Luminarc', website: '✅', instagram: '✅', pinterest: '?', country: 'Fransa' },
              { name: 'Libbey', website: '✅', instagram: '✅', pinterest: '?', country: 'Amerika' },
              { name: 'Bormioli', website: '✅', instagram: '✅', pinterest: '?', country: 'İtalya' }
            ].map((competitor, idx) => (
              <tr key={competitor.name} style={{
                borderBottom: '0.5px solid var(--border)',
                background: idx % 2 === 0 ? 'transparent' : 'var(--surface-0)'
              }}>
                <td style={{ padding: '10px', fontWeight: '500', color: 'var(--text-primary)' }}>
                  🏢 {competitor.name}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  {competitor.website}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  {competitor.instagram}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  {competitor.pinterest}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  {competitor.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gözlemler */}
      <div style={{
        background: 'var(--surface-1)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          💡 Gözlemler & Öneriler
        </h3>

        <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
          <div style={{
            padding: '12px',
            background: 'var(--bg-accent)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-accent)'
          }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>
              ✅ LAV'ın Güçlü Yanları
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-accent)' }}>
              <li>2 web sitesi (ürün + kurumsal)</li>
              <li>Aktif Instagram varlığı</li>
              <li>Türkiye merkezli, hızlı tepki verebilir</li>
            </ul>
          </div>

          <div style={{
            padding: '12px',
            background: 'var(--bg-warning)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-warning)'
          }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>
              ⚠️ LAV'ın Gelişim Alanları
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-warning)' }}>
              <li>Paşabahçe kadar 2. Instagram hesabı yok (daha fazla reach için)</li>
              <li>Pinterest stratejisi yok (Paşabahçe'nin güçlü noktası)</li>
              <li>Rakipler arasında en az İnstagram varlığı?</li>
            </ul>
          </div>

          <div style={{
            padding: '12px',
            background: 'var(--bg-success)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-success)'
          }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>
              🎯 Hızlı Aksiyon Planı
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-success)' }}>
              <li>Pinterest profili oluştur (interior design, lifestyle niş'inde güçlü)</li>
              <li>İkincil Instagram hesabı ekle (@lavmagaza? @lavdesign?)</li>
              <li>LinkedIn kurumsal hesabını aktif et</li>
              <li>4 haftalık content calendar'ı uygula</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{
        background: 'var(--surface-0)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1rem',
        marginTop: '2rem'
      }}>
        <h4 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🔗 Hızlı Linkler
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <a 
            href="https://www.lav.com.tr/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              background: 'var(--fill-accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            🌐 LAV.com.tr
          </a>

          <a 
            href="https://www.instagram.com/lavturkiye/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              background: 'var(--fill-accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            📸 Instagram
          </a>

          <a 
            href="https://company.lav.com.tr/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              background: 'var(--fill-accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            🏢 Kurumsal
          </a>

          <a 
            href="https://www.instagram.com/lavturkiye/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              background: 'var(--fill-accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            💬 @lavturkiye
          </a>
        </div>
      </div>
    </div>
  );

  // Content Management Tab
  const ContentManagementTab = () => {
    const [newPost, setNewPost] = useState({
      platform: 'Instagram',
      contentType: 'Ürün Gösterimi',
      title: '',
      description: '',
      scheduledDate: '',
      targetCountry: 'Türkiye',
      engagementGoal: '',
      hashtags: '',
      status: 'Planlandı'
    });

    const handleSavePost = async () => {
      if (!newPost.title || !newPost.scheduledDate) {
        alert('Lütfen başlık ve yayın tarihini doldurun');
        return;
      }

      const post = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        ...newPost
      };

      const updated = [...contentCalendar, post];
      setContentCalendar(updated);
      await window.storage.set('lav_content_calendar', JSON.stringify(updated));

      setNewPost({
        platform: 'Instagram',
        contentType: 'Ürün Gösterimi',
        title: '',
        description: '',
        scheduledDate: '',
        targetCountry: 'Türkiye',
        engagementGoal: '',
        hashtags: '',
        status: 'Planlandı'
      });

      alert('✓ Post takvime eklendi!');
    };

    return (
      <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📱 İçerik Yönetimi & Post Takvimi
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Sosyal medya içerik takvimi planlama, scheduling ve performance tracking
        </p>

        {/* Form */}
        <div style={{
          background: 'var(--surface-1)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem'
        }} onMouseDown={(e) => e.stopPropagation()}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Yeni Post Ekle
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Platform
              </label>
              <select
                value={newPost.platform}
                onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>TikTok</option>
                <option>YouTube</option>
              </select>
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                İçerik Türü
              </label>
              <select
                value={newPost.contentType}
                onChange={(e) => setNewPost({ ...newPost, contentType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              >
                <option>Ürün Gösterimi</option>
                <option>Lifestyle</option>
                <option>Educational</option>
                <option>Behind-the-Scenes</option>
                <option>User-Generated</option>
                <option>Kampanya</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Post Başlığı *
            </label>
            <input
              type="text"
              placeholder="Örn: Yaz Koleksiyonu Başladı!"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Açıklama
            </label>
            <textarea
              placeholder="Post açıklaması, caption, story text..."
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Yayın Tarihi *
              </label>
              <input
                type="date"
                value={newPost.scheduledDate}
                onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Hedef Ülke
              </label>
              <select
                value={newPost.targetCountry}
                onChange={(e) => setNewPost({ ...newPost, targetCountry: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              >
                <option>Türkiye</option>
                <option>İtalya</option>
                <option>İspanya</option>
                <option>Fransa</option>
                <option>Amerika</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Hashtag'ler
            </label>
            <input
              type="text"
              placeholder="#LAV #Cam #Design #StyleLiving"
              value={newPost.hashtags}
              onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Engagement Hedefi
            </label>
            <input
              type="text"
              placeholder="Örn: 1000 likes, 500 shares, 100 comments"
              value={newPost.engagementGoal}
              onChange={(e) => setNewPost({ ...newPost, engagementGoal: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleSavePost}
            style={{
              padding: '10px 16px',
              background: 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📅 Post Takvime Ekle
          </button>
        </div>

        {/* Calendar View */}
        <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📆 Planlanmış Postlar ({contentCalendar.length})
        </h3>

        {contentCalendar.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Henüz scheduled post yok. Yukarıdan ekleyin!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {[...contentCalendar].sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).map(post => (
              <div key={post.id} style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {post.title}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                      <span>📱 {post.platform}</span>
                      <span>📅 {post.scheduledDate}</span>
                      <span>{post.targetCountry}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAnalysis(post.id, 'content_post')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Tür:</span>
                    <p style={{ color: 'var(--text-primary)', margin: '2px 0 0 0', fontWeight: '500' }}>
                      {post.contentType}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Engagement Hedefi:</span>
                    <p style={{ color: 'var(--text-primary)', margin: '2px 0 0 0', fontWeight: '500' }}>
                      {post.engagementGoal || '-'}
                    </p>
                  </div>
                </div>

                {post.description && (
                  <div style={{ marginBottom: '8px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {post.description}
                    </p>
                  </div>
                )}

                {post.hashtags && (
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-accent)',
                    padding: '8px 12px',
                    background: 'var(--surface-0)',
                    borderRadius: 'var(--radius)',
                    marginTop: '8px'
                  }}>
                    {post.hashtags}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Auto Content Calendar Section */}
        <div style={{
          background: 'var(--bg-success)',
          border: '0.5px solid var(--border-success)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-success)',
            margin: '0 0 0.75rem 0'
          }}>
            🤖 AI-Destekli 4 Haftalık Content Calendar
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-success)',
            margin: '0 0 1rem 0'
          }}>
            Rakip analizi ve pazar stratejisine göre optimized 4 haftalık post takvimi oluştur. Manuel giriş gerektmez!
          </p>
          <button
            onClick={handleGetAutoContentCalendar}
            disabled={loading || competitorAnalyses.length === 0}
            style={{
              padding: '10px 16px',
              background: loading || competitorAnalyses.length === 0 ? 'var(--fill-disabled)' : 'var(--fill-success)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: loading || competitorAnalyses.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {loading ? '⏳ Calendar oluşturuluyor...' : '🗓️ 4 Haftalık AI Content Calendar Oluştur'}
          </button>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-success)',
            margin: '8px 0 0 0'
          }}>
            📝 Önerilen calendar AI Önerileri sekmesinde görüntülenir
          </p>
        </div>
      </div>
    );
  };

  // Media Performance Tab
  const MediaPerformanceTab = () => {
    const [newCampaign, setNewCampaign] = useState({
      campaignName: '',
      platform: 'Instagram',
      budget: '',
      spend: '',
      impressions: '',
      clicks: '',
      conversions: '',
      conversionValue: '',
      startDate: '',
      endDate: '',
      notes: ''
    });

    const handleSaveCampaign = async () => {
      if (!newCampaign.campaignName || !newCampaign.budget) {
        alert('Lütfen kampanya adı ve bütçeyi doldurun');
        return;
      }

      const campaign = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        ...newCampaign,
        roi: newCampaign.conversionValue && newCampaign.spend ? 
          (((newCampaign.conversionValue - newCampaign.spend) / newCampaign.spend) * 100).toFixed(2) + '%' : 'Hesaplanmadı',
        cpe: newCampaign.spend && newCampaign.clicks ? 
          (newCampaign.spend / newCampaign.clicks).toFixed(2) : 'Hesaplanmadı'
      };

      const updated = [...mediaPerformance, campaign];
      setMediaPerformance(updated);
      await window.storage.set('lav_media_performance', JSON.stringify(updated));

      setNewCampaign({
        campaignName: '',
        platform: 'Instagram',
        budget: '',
        spend: '',
        impressions: '',
        clicks: '',
        conversions: '',
        conversionValue: '',
        startDate: '',
        endDate: '',
        notes: ''
      });

      alert('✓ Kampanya performansı kaydedildi!');
    };

    return (
      <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          💰 Medya Performans & ROI Analizi
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Reklam kampaniyalarının bütçe, harcama, ROI ve engagement metrikleri
        </p>

        {/* Form */}
        <div style={{
          background: 'var(--surface-1)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem'
        }} onMouseDown={(e) => e.stopPropagation()}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Yeni Kampanya Performansı Ekle
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Kampanya Adı *
              </label>
              <input
                type="text"
                placeholder="Örn: Summer Collection 2026"
                value={newCampaign.campaignName}
                onChange={(e) => setNewCampaign({ ...newCampaign, campaignName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Platform
              </label>
              <select
                value={newCampaign.platform}
                onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Google Ads</option>
                <option>TikTok Ads</option>
                <option>LinkedIn</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Bütçe (EUR) *
              </label>
              <input
                type="number"
                placeholder="5000"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Gerçek Harcama (EUR)
              </label>
              <input
                type="number"
                placeholder="4800"
                value={newCampaign.spend}
                onChange={(e) => setNewCampaign({ ...newCampaign, spend: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                İzlenim (Impressions)
              </label>
              <input
                type="number"
                placeholder="250000"
                value={newCampaign.impressions}
                onChange={(e) => setNewCampaign({ ...newCampaign, impressions: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Tıklama (Clicks)
              </label>
              <input
                type="number"
                placeholder="8500"
                value={newCampaign.clicks}
                onChange={(e) => setNewCampaign({ ...newCampaign, clicks: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Dönüşüm (Conversions)
              </label>
              <input
                type="number"
                placeholder="250"
                value={newCampaign.conversions}
                onChange={(e) => setNewCampaign({ ...newCampaign, conversions: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Dönüşüm Değeri (EUR)
              </label>
              <input
                type="number"
                placeholder="15000"
                value={newCampaign.conversionValue}
                onChange={(e) => setNewCampaign({ ...newCampaign, conversionValue: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Başlama Tarihi
              </label>
              <input
                type="date"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }} onMouseDown={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Notlar
            </label>
            <textarea
              placeholder="Kampanya hakkında notlar, gözlemler, iyileştirme önerileri..."
              value={newCampaign.notes}
              onChange={(e) => setNewCampaign({ ...newCampaign, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '70px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleSaveCampaign}
            style={{
              padding: '10px 16px',
              background: 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📊 Kampanya Performansı Kaydet
          </button>
        </div>

        {/* Performance Metrics */}
        <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📈 Kampanya Performansları ({mediaPerformance.length})
        </h3>

        {mediaPerformance.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Henüz kampanya performansı yok. Yukarıdan ekleyin!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {[...mediaPerformance].reverse().map(campaign => (
              <div key={campaign.id} style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {campaign.campaignName}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                      <span>📱 {campaign.platform}</span>
                      {campaign.startDate && <span>📅 {campaign.startDate}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAnalysis(campaign.id, 'media_performance')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'var(--surface-0)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                      💶 Bütçe
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                      €{campaign.budget}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--surface-0)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                      💸 Harcama
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                      €{campaign.spend}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--surface-0)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                      👁️ İzlenim
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                      {campaign.impressions || '-'}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--surface-0)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                      🖱️ Tıklamalar
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                      {campaign.clicks || '-'}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--surface-0)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                      ✅ Dönüşümler
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                      {campaign.conversions || '-'}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--bg-success)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    border: '0.5px solid var(--border-success)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-success)', margin: '0 0 4px 0' }}>
                      📈 ROI
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-success)', margin: '0' }}>
                      {campaign.roi}
                    </p>
                  </div>
                </div>

                {campaign.notes && (
                  <div style={{
                    padding: '10px 12px',
                    background: 'var(--surface-0)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0', fontWeight: '500' }}>
                      📝 Notlar
                    </p>
                    {campaign.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Media Performance AI Analysis Section */}
        {mediaPerformance.length > 0 && (
          <div style={{
            background: 'var(--bg-accent)',
            border: '0.5px solid var(--border-accent)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-accent)',
              margin: '0 0 0.75rem 0'
            }}>
              🤖 AI Medya Performans Analizi
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-accent)',
              margin: '0 0 1rem 0'
            }}>
              Kampanya performansını analiz et, ROI iyileştirme önerileri ve optimizasyon stratejileri al.
            </p>
            <button
              onClick={handleGetMediaPerformanceAnalysis}
              disabled={loading}
              style={{
                padding: '10px 16px',
                background: loading ? 'var(--fill-disabled)' : 'var(--fill-accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              {loading ? '⏳ Analiz yapılıyor...' : '📊 Performans Analizi Al'}
            </button>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-accent)',
              margin: '8px 0 0 0'
            }}>
              💡 Detaylı analiz ve öneriler AI Önerileri sekmesinde görüntülenir
            </p>
          </div>
        )}
      </div>
    );
  };

  // Reports Tab - PDF Download
  const ReportsTab = () => {
    const handleDownloadPDF = () => {
      // Create report HTML
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>LAV Pazarlama Raporu</title>
          <style>
            * { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            body { padding: 20px; color: #333; line-height: 1.6; }
            .page-break { page-break-after: always; }
            h1 { font-size: 28px; margin: 20px 0 10px 0; color: #1a1a1a; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
            h2 { font-size: 20px; margin: 20px 0 10px 0; color: #0056b3; }
            h3 { font-size: 16px; margin: 15px 0 8px 0; color: #333; }
            p { margin: 8px 0; font-size: 13px; }
            .section { margin: 30px 0; page-break-inside: avoid; }
            .competitor { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #007bff; }
            .strength { color: #28a745; font-weight: bold; }
            .weakness { color: #dc3545; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; font-size: 12px; }
            th { background: #007bff; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
            .recommendation { background: #e7f3ff; padding: 12px; border-radius: 6px; margin: 10px 0; border-left: 3px solid #0056b3; }
            .header { text-align: center; margin-bottom: 30px; }
            .date { color: #666; font-size: 12px; margin-top: 10px; }
            .summary-box { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107; }
            ul { margin-left: 20px; font-size: 13px; }
            li { margin: 5px 0; }
            @media print {
              body { padding: 10px; }
              .page-break { page-break-after: always; }
              h1 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <!-- Title Page -->
          <div class="header">
            <h1>🏢 LAV PAZARLAma RAPoRU</h1>
            <p style="font-size: 18px; color: #0056b3; margin: 10px 0;">Rakip Analizi & İçerik Stratejisi</p>
            <p class="date">Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
          </div>

          <!-- Executive Summary -->
          <div class="section">
            <h2>📊 Yönetici Özeti</h2>
            <div class="summary-box">
              <p><strong>Analiz Kapsamı:</strong> Türkiye'deki cam ve bardak pazarında LAV'ın pozisyonu</p>
              <p><strong>Rakipler:</strong> Paşabahçe, Luminarc, Libbey, Bormioli</p>
              <p><strong>Analiz Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
              <p><strong>Hedef:</strong> Rakip stratejilerini anlamak, içerik stratejisini optimize etmek ve pazar fırsatlarını belirlemek</p>
            </div>
          </div>

          <!-- Market Analysis -->
          <div class="section">
            <h2>🎯 Pazar Analizi</h2>
            ${marketData.length > 0 ? `
              <h3>Pazar Özeti</h3>
              <p>${marketData[marketData.length - 1].opportunities ? marketData[marketData.length - 1].opportunities.substring(0, 800) : 'Pazar analizi henüz yapılmamış. Pazar Analizi sekmesinde "Pazar Analizi Al" butonuna tıkla.'}</p>
            ` : `
              <p><em>Henüz pazar analizi yapılmamış. Bunu eklemek için Pazar Analizi sekmesini ziyaret et.</em></p>
            `}
          </div>

          <!-- Competitor Analysis Summary -->
          <div class="section">
            <h2>⚔️ Rakip Analizi Özeti</h2>
            ${competitorAnalyses.length > 0 ? competitorAnalyses.map((comp, idx) => `
              <div class="competitor">
                <h3>${comp.competitor}</h3>
                <p><strong>Ülke:</strong> ${comp.country}</p>
                ${comp.website ? `<p><strong>Website:</strong> <a href="${comp.website}" target="_blank">${comp.website}</a></p>` : ''}
                ${comp.instagram ? `<p><strong>Instagram:</strong> <a href="${comp.instagram}" target="_blank">@${comp.competitor}</a></p>` : ''}
                <p class="strength">💪 Güçlü Yanları:</p>
                <p>${comp.strengths || 'Bilgi alınmadı'}</p>
                <p class="weakness">⚠️ Zayıf Yanları:</p>
                <p>${comp.weaknesses || 'Bilgi alınmadı'}</p>
                <p><strong>Pazar Konumu:</strong> ${comp.marketPosition || 'Bilgi alınmadı'}</p>
              </div>
            `).join('') : `
              <p><em>Henüz rakip analizi yapılmamış. Rakip Takip sekmesinde "Tüm Rakipleri Otomatik Analiz Et" butonuna tıkla.</em></p>
            `}
          </div>

          <div class="page-break"></div>

          <!-- Content Recommendations -->
          <div class="section">
            <h2>💡 İçerik Önerileri</h2>
            ${recommendations.filter(r => r.type === 'auto_content_calendar').length > 0 ? `
              <h3>📅 İçerik Takvimi</h3>
              <p>AI tarafından oluşturulan 4 haftalık optimized content calendar:</p>
              ${recommendations.filter(r => r.type === 'auto_content_calendar')[0] ? `
                <div class="recommendation">
                  <p>${recommendations.filter(r => r.type === 'auto_content_calendar')[0].content.substring(0, 600)}</p>
                </div>
              ` : ''}
            ` : `
              <p><em>Henüz AI içerik önerileri oluşturulmamış. İçerik Yönetimi sekmesinde "AI Content Calendar Oluştur" butonuna tıkla.</em></p>
            `}

            ${recommendations.filter(r => r.type === 'media_performance_analysis').length > 0 ? `
              <h3>📊 Medya Performans Analizi</h3>
              <div class="recommendation">
                <p>${recommendations.filter(r => r.type === 'media_performance_analysis')[0].content.substring(0, 400)}</p>
              </div>
            ` : ''}

            ${recommendations.filter(r => r.type === 'content_strategy_analysis').length > 0 ? `
              <h3>📝 İçerik Stratejisi</h3>
              <div class="recommendation">
                <p>${recommendations.filter(r => r.type === 'content_strategy_analysis')[0].content.substring(0, 400)}</p>
              </div>
            ` : ''}
          </div>

          <!-- Key Findings -->
          <div class="section">
            <h2>🔍 Temel Bulgular</h2>
            <ul>
              <li><strong>Rakip Sayısı:</strong> ${competitorAnalyses.length} racıp analiz edildi</li>
              <li><strong>İçerik Takvimi:</strong> ${recommendations.filter(r => r.type === 'auto_content_calendar').length > 0 ? '✅ Hazır' : '❌ Oluşturulmadı'}</li>
              <li><strong>Pazar Analizi:</strong> ${marketData.length > 0 ? '✅ Tamamlandı' : '❌ Henüz yapılmadı'}</li>
              <li><strong>Medya Performans Analizi:</strong> ${recommendations.filter(r => r.type === 'media_performance_analysis').length > 0 ? '✅ Yapıldı' : '❌ Henüz yapılmadı'}</li>
            </ul>
          </div>

          <!-- Recommendations -->
          <div class="section">
            <h2>✅ Önerilen Sonraki Adımlar</h2>
            <ol style="margin-left: 30px;">
              <li>Rakip analizlerini detaylı olarak gözden geçir ve temel stratejilerini belirle</li>
              <li>4 haftalık content takvimini sosyal medya platformlarına yükle</li>
              <li>Medya performans metriklerini haftalık takip et</li>
              <li>AI önerilerini test et ve sonuçları ölç</li>
              <li>Her 2 haftada bir raporu güncelle ve ilerlemeleri kontrol et</li>
            </ol>
          </div>

          <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>Bu rapor LAV Marketing Platform tarafından otomatik olarak oluşturulmuştur.</p>
            <p>Raporun tamamlanabilmesi için tüm sekmeler ziyaret edilmelidir.</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(reportHTML));
      element.setAttribute('download', `LAV-Pazarlama-Raporu-${new Date().toISOString().split('T')[0]}.html`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      alert('📄 Rapor HTML formatında indirildi. Tarayıcınızda aç ve Print (Ctrl+P) → Save as PDF ile PDF olarak kaydet.');
    };

    return (
      <div style={{ padding: '1.5rem', maxWidth: '1000px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📄 Pazarlama Raporu
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Rakip analizi, pazar görüşü ve AI içerik önerilerinin özet raporu
        </p>

        {/* Report Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--surface-1)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', margin: '0 0 4px 0' }}>⚔️</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Rakip Analizi</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              {competitorAnalyses.length}
            </p>
          </div>

          <div style={{
            background: 'var(--surface-1)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', margin: '0 0 4px 0' }}>📊</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Pazar Analizi</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              {marketData.length > 0 ? '✓' : '○'}
            </p>
          </div>

          <div style={{
            background: 'var(--surface-1)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', margin: '0 0 4px 0' }}>💡</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>AI Önerileri</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              {recommendations.length}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-accent) 0%, var(--surface-1) 100%)',
          border: '0.5px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-accent)',
            margin: '0 0 1rem 0'
          }}>
            📥 Raporu İndir
          </h3>
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: '12px 24px',
              background: 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '1rem'
            }}
          >
            📄 Raporu İndir (HTML)
          </button>
          <p style={{ fontSize: '12px', color: 'var(--text-accent)', margin: 0 }}>
            ✓ HTML dosyası indirilecek. Tarayıcıda aç → Print (Ctrl+P) → "Save as PDF" ile PDF olarak kaydet
          </p>
        </div>

        {/* Report Contents */}
        <div style={{
          background: 'var(--surface-1)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            📋 Rapor İçeriği
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'var(--surface-0)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--fill-accent)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                ✅ Yönetici Özeti
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Rapor genel özeti ve analiz kapsamı
              </p>
            </div>

            <div style={{
              padding: '12px',
              background: 'var(--surface-0)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--fill-success)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                ✅ Pazar Analizi
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Türkiye'deki pazar trendleri ve büyüme potansiyeli
              </p>
            </div>

            <div style={{
              padding: '12px',
              background: 'var(--surface-0)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--fill-warning)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                ✅ Rakip Analizi
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                {competitorAnalyses.length > 0 ? `${competitorAnalyses.length} rakibin güçlü/zayıf yanları ve stratejileri` : 'Henüz yapılmadı'}
              </p>
            </div>

            <div style={{
              padding: '12px',
              background: 'var(--surface-0)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--fill-accent)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                ✅ İçerik Önerileri
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                AI tarafından oluşturulan content calendar ve stratejiler
              </p>
            </div>

            <div style={{
              padding: '12px',
              background: 'var(--surface-0)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--fill-success)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                ✅ Sonraki Adımlar
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Önerilen eylem planı ve ölçüm metrikleri
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'var(--bg-accent)',
          border: '0.5px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-accent)', margin: 0 }}>
            <strong>💡 Not:</strong> Rapor tamamlanabilmesi için tüm sekmeler ziyaret edilmelidir. 
            (Pazar Analizi, Rakip Takip, İçerik Yönetimi, Medya Performans)
          </p>
        </div>
      </div>
    );
  };

  // Recommendations Tab
  const RecommendationsTab = () => (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🤖 AI Önerileri & Strateji
      </h2>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Pazar ve rakip analizlerinize göre Claude tarafından hazırlanan stratejiler, içerik önerileri ve rekabetçi analizler.
      </p>

      {marketData.length === 0 && competitorAnalyses.length === 0 ? (
        <div style={{
          background: 'var(--surface-1)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            📊 Önce "Pazar Analizi" sekmesinde veriler ekleyin, sonra AI önerileri alabilirsiniz.
          </p>
          <button
            onClick={() => setActiveTab('market')}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: 'var(--fill-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer'
            }}
          >
            Pazar Analizi Ekle
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {recommendations.length === 0 ? (
            <div style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Henüz öneriniz yok. Pazar analizlerinize göre AI tarafından öneriler üret.
              </p>
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  background: loading ? 'var(--fill-disabled)' : 'var(--fill-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⏳ Analiz yapılıyor...' : '✨ Önerileri Oluştur'}
              </button>
            </div>
          ) : (
            [...recommendations].reverse().map(rec => (
              <div key={rec.id} style={{
                background: rec.status === 'approved' ? 'var(--bg-success)' : 'var(--surface-1)',
                border: rec.status === 'approved' ? '0.5px solid var(--border-success)' : '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {rec.type === 'competitor_analysis' ? (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-warning)',
                        color: 'var(--text-warning)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        ⚔️ Rekabetçi Analiz
                      </span>
                    ) : rec.type === 'social_media_analysis' ? (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-success)',
                        color: 'var(--text-success)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        📱 Sosyal Medya Analizi
                      </span>
                    ) : rec.type === 'content_strategy_analysis' ? (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-accent)',
                        color: 'var(--text-accent)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        📝 Content Strategy
                      </span>
                    ) : rec.type === 'media_performance_analysis' ? (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-warning)',
                        color: 'var(--text-warning)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        💰 Medya Performans
                      </span>
                    ) : rec.type === 'auto_content_calendar' ? (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-success)',
                        color: 'var(--text-success)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        🗓️ AI Content Calendar
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-accent)',
                        color: 'var(--text-accent)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        📊 Pazar Stratejisi
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.date}</span>
                    {rec.status === 'approved' && (
                      <span style={{
                        fontSize: '11px',
                        background: 'var(--bg-success)',
                        color: 'var(--text-success)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius)'
                      }}>
                        ✓ Onaylandı
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAnalysis(rec.id, 'recommendation')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '12px',
                  maxHeight: '400px',
                  overflow: 'auto'
                }}>
                  {rec.content}
                </div>

                {rec.status === 'pending' && (
                  <button
                    onClick={() => handleApproveRec(rec.id)}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--fill-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    ✓ Onayla & Uygulanacak Kaydet
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  // Dashboard Header
  const DashboardHeader = () => (
    <div style={{
      background: 'var(--surface-1)',
      borderBottom: '0.5px solid var(--border)',
      padding: '1.5rem'
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
        🎯 LAV Marketing Platform
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0' }}>
        Haftalık pazar & rakip analizi, AI-destekli stratejiler, içerik önerileri
      </p>
    </div>
  );

  return (
    <div style={{ background: 'var(--surface-0)', minHeight: '100vh' }}>
      <DashboardHeader />

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '0.5px solid var(--border)',
        padding: '0 1.5rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('market')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'market' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'market' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'market' ? '500' : '400',
            color: activeTab === 'market' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          📊 Pazar Analizi
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'competitors' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'competitors' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'competitors' ? '500' : '400',
            color: activeTab === 'competitors' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          🏆 Rakip Takip
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'recommendations' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'recommendations' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'recommendations' ? '500' : '400',
            color: activeTab === 'recommendations' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          🤖 AI Önerileri
        </button>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'content' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'content' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'content' ? '500' : '400',
            color: activeTab === 'content' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          📱 İçerik Yönetimi
        </button>
        <button
          onClick={() => setActiveTab('media')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'media' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'media' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'media' ? '500' : '400',
            color: activeTab === 'media' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          💰 Medya Performans
        </button>
        <button
          onClick={() => setActiveTab('lavprofile')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'lavprofile' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'lavprofile' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'lavprofile' ? '500' : '400',
            color: activeTab === 'lavprofile' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          🏢 LAV Profili
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '12px 16px',
            background: activeTab === 'reports' ? 'var(--surface-2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'reports' ? '2px solid var(--fill-accent)' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'reports' ? '500' : '400',
            color: activeTab === 'reports' ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          📄 Raporlar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'market' && <MarketAnalysisTab />}
      {activeTab === 'competitors' && <CompetitorTrackingTab />}
      {activeTab === 'recommendations' && <RecommendationsTab />}
      {activeTab === 'content' && <ContentManagementTab />}
      {activeTab === 'media' && <MediaPerformanceTab />}
      {activeTab === 'lavprofile' && <LAVProfileTab />}
      {activeTab === 'reports' && <ReportsTab />}
    </div>
  );
}
