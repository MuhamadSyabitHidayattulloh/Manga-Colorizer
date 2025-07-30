import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProcessedImage } from '../types';
import { StorageService } from '../utils/storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const [favorites, setFavorites] = useState<ProcessedImage[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [historyData, favoritesData] = await Promise.all([
        StorageService.getProcessingHistory(),
        StorageService.getFavorites(),
      ]);
      setHistory(historyData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all processing history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearProcessingHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const toggleFavorite = async (image: ProcessedImage) => {
    try {
      const isFav = await StorageService.isFavorite(image.id);
      if (isFav) {
        await StorageService.removeFromFavorites(image.id);
        setFavorites(prev => prev.filter(fav => fav.id !== image.id));
      } else {
        await StorageService.addToFavorites(image);
        setFavorites(prev => [image, ...prev]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const renderImageItem = ({ item }: { item: ProcessedImage }) => (
    <View style={styles.imageItem}>
      <Image
        source={{ uri: item.processedUri || item.originalUri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      
      <View style={styles.imageInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.processingTime}>
          {item.processingTime > 0 
            ? `Processed in ${(item.processingTime / 1000).toFixed(1)}s`
            : 'Processing failed'
          }
        </Text>
        {item.error && (
          <Text style={styles.errorText} numberOfLines={2}>
            Error: {item.error}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item)}
      >
        <Ionicons
          name={favorites.some(fav => fav.id === item.id) ? "heart" : "heart-outline"}
          size={24}
          color="#ff4444"
        />
      </TouchableOpacity>
    </View>
  );

  const currentData = activeTab === 'history' ? history : favorites;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={activeTab === 'history' ? '#007AFF' : '#666'}
            />
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History ({history.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Ionicons
              name="heart-outline"
              size={20}
              color={activeTab === 'favorites' ? '#007AFF' : '#666'}
            />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'history' && history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>

      {currentData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={activeTab === 'history' ? "time-outline" : "heart-outline"}
            size={64}
            color="#666"
          />
          <Text style={styles.emptyText}>
            No {activeTab === 'history' ? 'processing history' : 'favorites'} yet
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'history'
              ? 'Process some images to see them here'
              : 'Add images to favorites to see them here'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#3a3a3a',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#007AFF',
  },
  clearButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  imageItem: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  processingTime: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
  },
  favoriteButton: {
    padding: 8,
  },
});

