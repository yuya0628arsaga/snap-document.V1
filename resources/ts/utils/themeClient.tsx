const color = {
    background: {
        lightGray: '#f9f9f9',
        lightBlue: '#F4F7FA',
        white: '#FFFFFF',
        blue: '#00A4FF',
        buttonGray: '#ececec',
        yellow: '#FFD700',
    },

    border: {
        gray: '#C3C3C3',
        blue: '#00A4FF',
        white: '#FFFFFF',
        black: '#444444',
    },

    text: {
        // error: '#ff0000'
        error: '#b91c1c',
        white: '#FFFFFF',
        linkBlue: '#3D89E4',
        black: '#0D0D0D'
    }
}

  const font = {
    size: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    weight: {
      normal: '400',
      bold: '700',
    },
  }

  const line = {
    height: {
      sm: '18px',
      md: '21px',
      lg: '24px',
      xl: '30px',
      xxl: '36px',
    },
  }

export const responsive = {
    pc: '1280px',
    tab: '960px',
    sp: '520px',
}

// color
export const bgColor = color.background
export const borderColor = color.border
export const textColor = color.text

// font
export const fontSize = font.size
export const fontWeight = font.weight

// line
export const lineHeight = line.height