'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Clock, MapPin, Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineItem {
  id: string;
  time: string;
  duration: number;
  title: string;
  description?: string;
  location?: string;
  vendors: any[];
}

export function TimelineBuilder({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setItems(newItems);
    // Save new order to API
  };
  
  const addTimelineItem = (item: TimelineItem) => {
    setItems([...items, item]);
    setIsAdding(false);
    // Save to API
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Day-of Timeline</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="timeline">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border rounded-lg p-4 bg-white ${
                        snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="flex items-center gap-1 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              {format(new Date(item.time), 'h:mm a')}
                            </span>
                            <span className="text-sm text-gray-500">
                              {item.duration} min
                            </span>
                          </div>
                          
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </span>
                            )}
                            {item.vendors.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {item.vendors.length} vendors
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {isAdding && (
        <TimelineItemForm
          onSave={addTimelineItem}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  );
}