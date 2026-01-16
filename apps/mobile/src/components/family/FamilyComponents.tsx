
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FamilyMember, SharedItemWrapper } from '@lcc/types';
import { formatDistanceToNow } from 'date-fns';
import { Users, BookOpen, Quote, MapPin } from 'lucide-react-native';

// ==========================================
// MEMBER CARD
// ==========================================

export const MemberCard = ({ member, onPress }: { member: FamilyMember; onPress?: () => void }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-3"
    >
      <View className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mr-4">
        {member.avatar ? (
          <Image source={{ uri: member.avatar }} className="w-full h-full" />
        ) : (
          <View className="items-center justify-center flex-1">
            <Users size={20} color="#71717a" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-zinc-900 dark:text-white">
          {member.name}
        </Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          {member.relationship}
        </Text>
      </View>
      
      {member.status === 'pending' && (
        <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
          <Text className="text-xs font-medium text-amber-700 dark:text-amber-400">
             Pending
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ==========================================
// SHARED FEED ITEM
// ==========================================

export const SharedFeedItem = ({ item }: { item: SharedItemWrapper }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'journal': return <BookOpen size={16} color="#6366f1" />;
      case 'life_chapter': return <MapPin size={16} color="#059669" />;
      case 'question_answer': return <Quote size={16} color="#f59e0b" />;
      default: return <BookOpen size={16} color="#71717a" />;
    }
  };

  const getLabel = () => {
    switch (item.type) {
      case 'journal': return 'Shared a Journal Entry';
      case 'life_chapter': return 'Added a Life Chapter';
      case 'question_answer': return 'Answered a Question';
      default: return 'Shared an item';
    }
  };

  // Determine border color based on type
  const borderColor = item.type === 'journal' ? 'border-indigo-100 dark:border-indigo-900/30' :
                      item.type === 'life_chapter' ? 'border-emerald-100 dark:border-emerald-900/30' :
                      'border-amber-100 dark:border-amber-900/30';

  return (
    <View className={`bg-white dark:bg-zinc-900 rounded-2xl border mb-4 overflow-hidden ${borderColor}`}>
      {/* Header */}
      <View className="flex-row items-center p-4 pb-2">
        <View className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 mr-3 items-center justify-center overflow-hidden">
             {/* TODO: Look up avatar from family store using item.authorId */}
             <Users size={14} color="#a1a1aa" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-zinc-900 dark:text-white">
            {item.authorName}
          </Text>
          <View className="flex-row items-center">
            {getIcon()}
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
              {getLabel()} • {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 pb-4">
        <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-6" numberOfLines={4}>
          {item.content}
        </Text>
      </View>

      {/* Footer */}
      <View className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 flex-row items-center justify-between">
        <Text className="text-xs text-zinc-400 font-medium">
          Only visible to Family
        </Text>
        <TouchableOpacity>
           {/* TODO: Add reaction functionality */}
        </TouchableOpacity>
      </View>
    </View>
  );
};
