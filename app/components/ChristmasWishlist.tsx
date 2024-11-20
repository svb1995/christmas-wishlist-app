"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { PlusCircle, Trash2, Gift, ChevronRight, Download, Upload, Settings, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

interface WishlistItems {
  [key: string]: string[];
}

const ChristmasWishlist = () => {
  // Initialize translations
  const t = useTranslations();

  const [wishlists, setWishlists] = useState<WishlistItems>({});
  const [currentPerson, setCurrentPerson] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedWishlists = localStorage.getItem('christmas-wishlists-2024');
      const backupWishlists = localStorage.getItem('christmas-wishlists-2024-backup');

      if (savedWishlists) {
        try {
          setWishlists(JSON.parse(savedWishlists));
        } catch (error) {
          if (backupWishlists) {
            try {
              setWishlists(JSON.parse(backupWishlists));
            } catch (error) {
              console.error('Error loading wishlists:', error);
            }
          }
        }
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        const wishlistsJson = JSON.stringify(wishlists);
        localStorage.setItem('christmas-wishlists-2024', wishlistsJson);
        localStorage.setItem('christmas-wishlists-2024-backup', wishlistsJson);
      } catch (error) {
        console.error('Error saving wishlists:', error);
      }
    }
  }, [wishlists, isClient]);

  const exportWishlists = () => {
    const dataStr = JSON.stringify(wishlists, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'christmas-wishlist-2024.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importWishlists = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedData = JSON.parse(result);
            setWishlists(importedData);
          }
        } catch (error) {
          console.error('Error importing wishlists:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const shareToWhatsApp = (person: string, items: string[]) => {
    if (items.length === 0) {
      alert(t('wishlist.noItemsToShare'));
      return;
    }

    const wishlistText = `🎄 *${person}${t('wishlist.title')}* 🎁\n\n${items.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    const encodedText = encodeURIComponent(wishlistText);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      alert(t('wishlist.shareError'));
    }
  };

  const addItem = (person: string) => {
    if (!currentItem.trim()) return;
    setWishlists(prev => ({
      ...prev,
      [person]: [...(prev[person] || []), currentItem.trim()]
    }));
    setCurrentItem('');
  };

  const removePerson = (person: string) => {
    setWishlists(prev => {
      const newLists = { ...prev };
      delete newLists[person];
      return newLists;
    });
  };

  const removeItem = (person: string, index: number) => {
    setWishlists(prev => ({
      ...prev,
      [person]: prev[person].filter((_, i) => i !== index)
    }));
  };

  const addPerson = () => {
    if (!currentPerson.trim()) return;
    if (wishlists[currentPerson]) return;
    setWishlists(prev => ({
      ...prev,
      [currentPerson]: []
    }));
    setCurrentPerson('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        <div className="bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 py-6 relative">
            {/* Header with Settings and Language Switcher */}
            <div className="absolute top-6 right-4 flex items-center gap-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute top-16 right-4 bg-gray-800 shadow-lg rounded-lg p-4 space-y-4 w-72 z-10">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium text-white mb-2">{t('settings.title')}</h3>
                  <Button 
                    onClick={exportWishlists}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('settings.export')}
                  </Button>
                  <label className="w-full">
                    <Button 
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t('settings.import')}
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importWishlists}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-4xl font-bold text-center mb-2 text-white">
              {t('title')}
            </h1>
            <p className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent">
              {t('subtitle')}
            </p>

            {/* Add Person Form */}
            <div className="max-w-xl mx-auto">
              <div className="flex gap-4 items-center bg-gray-800 shadow rounded-lg p-2">
                <input
                  type="text"
                  placeholder={t('addPerson.placeholder')}
                  value={currentPerson}
                  onChange={(e) => setCurrentPerson(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addPerson)}
                  className="flex-1 text-lg bg-transparent border-0 text-white placeholder-gray-400 outline-none rounded-lg px-4 py-2"
                />
                <Button 
                  onClick={addPerson}
                  className="bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-base px-6"
                >
                  {t('addPerson.button')}
                </Button>
              </div>
              <p className="text-center text-gray-400 mt-6 text-sm">
                {t('addPerson.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlists Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {Object.entries(wishlists).map(([person, items]) => (
            <Card 
              key={person} 
              className="bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="border-b border-gray-700 pb-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Gift className="h-6 w-6 text-gray-400" />
                      <h2 className="text-2xl font-medium text-white">
                        {person}{t('wishlist.title')}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => shareToWhatsApp(person, items)}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title={t('wishlist.shareViaWhatsApp')}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => removePerson(person)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder={t('wishlist.addWish')}
                    value={person === currentPerson ? currentItem : ''}
                    onChange={(e) => setCurrentItem(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addItem(person))}
                    className="flex-1 text-lg bg-gray-700 border-0 text-white placeholder-gray-400 outline-none rounded-lg px-4 py-2"
                    onFocus={() => setCurrentPerson(person)}
                  />
                  <Button 
                    onClick={() => addItem(person)}
                    className="bg-gray-700 text-white hover:bg-gray-600 transition-colors px-6"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    {t('wishlist.addButton')}
                  </Button>
                </div>

                <ul className="space-y-3">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="group flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5 text-gray-400" />
                        <span className="text-lg text-white">{item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => removeItem(person, index)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </li>
                  ))}
                </ul>

                {items.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      {t('wishlist.noWishes')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.entries(wishlists).length === 0 && (
          <div className="text-center py-16">
            <Gift className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-xl">
              {t('empty')}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          {t('footer')}
        </div>
      </div>
    </div>
  );
};

export default ChristmasWishlist;