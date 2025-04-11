import React from 'react';
import { Checkbox } from '@mui/material';
import styles from './LessonInfo.module.css';

const AnimatedCheckbox = ({ checked, onChange, color, icon }) => (
    <div
        className={`${styles.checkboxContainer} ${checked ? styles.checked : ''}`}
        style={{
            backgroundColor: checked ? color : 'transparent',
            borderColor: color
        }}
    >
        <Checkbox
            checked={checked}
            onChange={onChange}
            icon={React.cloneElement(icon, {
                style: {
                    color: color,
                    fontSize: 20
                }
            })}
            checkedIcon={React.cloneElement(icon, {
                style: {
                    color: 'white',
                    fontSize: 20
                }
            })}
            className={styles.checkbox}
        />
    </div>
);

export default AnimatedCheckbox;