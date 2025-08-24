/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			maxWidth: {
				'8xl': '1440px',
				'1/4': '25%',
				'1/2': '50%',
				'3/4': '75%'
			},
			transitionProperty: {
				['height']: 'height',
				['max-height']: 'max-height',
				['width']: 'width',
				['spacing']: 'margin, padding'
			},
			transitionBehaivior: {
				['discrete']: 'allow-discrete'
			},
			width: {
				['88']: '22rem',
				['1/8']: '`${(1 / 8) * 100}%`',
				['1/12']: '`${(1 / 12) * 100}%`'
			},
			fontFamily: {
				['jetbrains']: 'JetBrains Mono, monospace',
				['roboto']: 'Roboto, sans-serif',
				['pass']: 'pass'
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				scrollbar: 'hsl(var(--scrollbar))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				active: {
					DEFAULT: 'hsl(var(--active))',
					foreground: 'hsl(var(--active-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				table: {
					head: 'hsl(var(--table-head))',
					'head-foreground': 'hsl(var(--table-head-foreground))',
					'row-active': 'hsl(var(--table-row-active))',
					'row-selected': 'hsl(var(--table-row-selected))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			screens: {
				sm: {
					min: '360px',
					max: '599px'
				},
				md: {
					min: '600px',
					max: '1023px'
				},
				lg: {
					min: '1024px',
					max: '1365px'
				},
				xl: {
					min: '1366px'
				},
				xxl: {
					min: '1920px'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				['accordion-down']: {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				['accordion-up']: {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				['collapsible-down']: {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-collapsible-content-height)'
					}
				},
				['collapsible-up']: {
					from: {
						height: 'var(--radix-collapsible-content-height)'
					},
					to: {
						height: '0'
					}
				},
				['collapsible-up-reverse']: {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-collapsible-content-height)'
					}
				},
				['collapsible-down-reverse']: {
					from: {
						height: 'var(--radix-collapsible-content-height)'
					},
					to: {
						height: '0'
					}
				},
				['fade-in']: {
					from: { transform: 'scale(0.95)', opacity: 0 },
					to: {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				['drop-down']: {
					from: {
						transform: 'translateY(0)'
					},
					to: {
						transform: 'translateY(2rem)',
						width: 0
					}
				},

				['slide-in']: {
					from: {
						transform: 'translate3d(0,-100%,0)'
					},
					to: {
						transform: 'translateZ(0)'
					}
				},
				['fall-down']: {
					from: {
						transform: 'translate3d(0,-40px,0)'
					},
					to: {
						transform: 'translateZ(0)'
					}
				},
				['shimmer']: {
					from: {
						backgroundPosition: '0 0'
					},
					to: {
						backgroundPosition: '-200% 0'
					}
				},
				['spotlight']: {
					from: {
						opacity: '0',
						transform: 'translate(-75%, -60%) scale(0.5)'
					},
					to: {
						opacity: '1',
						transform: 'translate(-50%,-40%) scale(1)'
					}
				},
				['spotlight-off']: {
					from: {
						opacity: '1',
						transform: 'translate(-50%,-40%) scale(1)'
					},
					to: {
						opacity: '0',
						transform: 'translate(-75%, -60%) scale(0.95)'
					}
				},
				['scrolling']: {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(calc(-100% - 1rem))'
					}
				},
				['typing']: {
					from: {
						width: '0',
						opacity: '0.5'
					},
					to: {
						opacity: '1'
					}
				},
				['rotate-in']: {
					from: {
						opacity: '0',
						transform: 'rotate(45deg)'
					},
					to: {
						opacity: '1',
						transform: 'rotate(0deg)'
					}
				},
				['rotate-in-reverse']: {
					from: {
						opacity: '0',
						transform: 'rotate(-45deg)'
					},
					to: {
						opacity: '1',
						transform: 'rotate(0deg)'
					}
				}
			},
			animation: {
				['accordion-down']: 'accordion-down 0.2s ease-out',
				['accordion-up']: 'accordion-up 0.2s ease-out',
				['collapsible-up']: 'collapsible-up 0.2s ease-out',
				['collapsible-down']: 'collapsible-down 0.2s ease-out',
				['collapsible-up-reverse']: 'collapsible-up-reverse 0.2s ease-out',
				['collapsible-down-reverse']: 'collapsible-down-reverse 0.2s ease-out',
				['fade-in']: 'fade-in .5s cubic-bezier(.25,.25,0,1) .5s both!important',
				['slide-in']: 'slide-in .3s ease-out 0.75s both',
				['drop-down']: 'drop-down 1s linear',
				['scrolling']: 'scrolling 10s linear infinite both!important',
				['spotlight']: 'spotlight 1.5s ease 0.5s forwards',
				['spotlight-off']: 'spotlight-off 6s ease forwards',
				['shimmer']: 'shimmer 1.5s linear infinite',
				['typing']: 'typing 1.125s steps(25), 0.65s step-end 0s infinite alternate'
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.backface-hidden': {
					'backface-visibility': 'hidden'
				},
				'.transition-allow-discrete': {
					'transition-behavior': 'allow-discrete'
				}
			})
		}),
		require('tailwindcss-animate'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/container-queries'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms')({
			strategy: 'class' // only generate classes
		})
	]
}
