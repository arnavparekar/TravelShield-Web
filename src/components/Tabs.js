import React, { useEffect, useRef } from 'react';
import { BiListUl } from "react-icons/bi";
import { FaPlane } from "react-icons/fa";
import { MdWarning, MdCancel } from "react-icons/md";
import { gsap } from 'gsap';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabsRef = useRef(null);
  const focusEl1Ref = useRef(null);
  const focusEl2Ref = useRef(null);
  const tabRefs = useRef([]);
  const tlRef = useRef(gsap.timeline());
  
  const tabs = [
    { id: "List", icon: BiListUl },
    { id: "Safe to Travel", icon: FaPlane },
    { id: "Needs Review", icon: MdWarning },
    { id: "Not Eligible", icon: MdCancel }
  ];

  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const liRect = tabsRef.current.getBoundingClientRect();
    const tabWidth = (liRect.width - 16) / tabs.length; 
    const startPosition = 8;
    
    gsap.defaults({
      ease: "ease.inOut",
    });

    const handleTabClick = (index) => {
      const elRect = tabRefs.current[index].getBoundingClientRect();
      const timesWidth = 1;
      const animationDuration = 0.2;

      tlRef.current
        .to(focusEl1Ref.current, animationDuration, { 
          width: `${timesWidth * tabWidth}px` 
        })
        .to(focusEl1Ref.current, animationDuration, {
          left: `${startPosition + (index * tabWidth)}px`,
          width: `${tabWidth}px`,
        });
    };

    handleTabClick(currentIndex);
  }, [activeTab, tabs]);

  return (
    <div className="tab-container" style={{
      width: '600px',
      height: '40px',
      display: 'grid',
      placeItems: 'center'
    }}>
      <ul
        ref={tabsRef}
        style={{
          position: 'relative',
          width: '600px',
          height: '40px',
          display: 'grid',
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
          borderRadius: '999px',
          background: 'rgb(160, 252, 216)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          padding: '0 8px',
          margin: 0
        }}
      >
        {tabs.map(({ id, icon: Icon }, index) => (
          <li
            key={id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => setActiveTab(id)}
            style={{
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: activeTab === id ? 'rgb(29,73,115)' : 'rgb(100, 116, 139)',
              fontSize: '14px',
              fontWeight: 500,
              zIndex: 10,
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            <Icon size={14} />
            <span>{id}</span>
          </li>
        ))}
        <div
          ref={focusEl1Ref}
          style={{
            position: 'absolute',
            left: '8px', 
            top: '4px',
            width: `calc((100% - 16px) / ${tabs.length})`,
            height: 'calc(100% - 8px)',
            borderRadius: '999px',
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        />
        <div
          ref={focusEl2Ref}
          style={{
            position: 'absolute',
            left: `calc(-100% / ${tabs.length})`,
            top: '4px',
            width: `calc((100% - 16px) / ${tabs.length})`,
            height: 'calc(100% - 8px)',
            borderRadius: '999px',
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        />
      </ul>
    </div>
  );
};

export default Tabs;