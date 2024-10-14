const Response = {
    success: { type: 'boolean', example: true },
    result: {type: 'object', properties: {
      count: {type: 'number', example: '1'},
      rows: {type: 'array', items: {
        type: 'object',
        properties: {
          project_id: {type: 'number', example: 473},
          wallet_id: {type: 'number', example: 113},
          network_id: {type: 'number', example: 4},
          project_name: {type: 'string', example: "New"},
          project_sub_title: {type: 'string', example: "abc"},
          project_website: {type: 'string', example: "https://website.com"},
          project_email: {type: 'string', example: "traam@yopmail.com"},
          project_white_paper: {type: 'string', example: ""},
          project_additional_info: {type: 'string', example: ""},
          project_twitter: {type: 'string', example: ""},
          project_telegram: {type: 'string', example: ""},
          project_medium: {type: 'string', example: ""},
          project_discord: {type: 'string', example: ""},
          token_contract_address: {type: 'string', example: "0xe0E69149bd1d768E396Ea71983922789fC46995C"},
          token_name: {type: 'string', example: "latoken"},
          token_symbol: {type: 'string', example: "32565"},
          token_decimal: {type: 'string', example: 18},
          payment_currency: {type: 'string', example: "ETH"},
          list_amm: {type: 'string', example: "Uniswap"},
          currency_pair: {type: 'string', example: "UNISWAP"},
          contract_address: {type: 'string', example: "0x585D0D8BDBD55c5a8FEa5b2a8772039aD8C354a9"},
          pair_address: {type: 'string', example: null},
          is_list_on_uniswap: {type: 'boolean', example: null},
          is_transfer_daolaunch_fee: {type: 'boolean', example: true},
          is_featured_project: {type: 'boolean', example: false},
          sale_round_launch: {type: 'number', example: null},
          round: {type: 'number', example: 1},
          created_at: {type: 'string', example: '2021-09-24T09:30:01.000Z'},
          updated_at: {type: 'string', example: '2021-09-27T02:50:10.000Z'},
          whitelist_address_csv: {type: 'string', example: null},
          follow_number: {type: 'number', example: 1},
          total_nfts: {type: 'number', example: 0},
          sale: { type: 'object' , properties : {
            sale_id: {type: 'number', example: 411},
            project_id: {type: 'number', example: 411},
            wallet_token_balance: {type: 'string', example: null},
            sale_allocation: {type: 'number', example: 1000000},
            swap_ratio: {type: 'number', example: 10000},
            hard_cap: {type: 'number', example: 70},
            soft_cap: {type: 'number', example: 0.01},
            max_allocation_wallet_limit: {type: 'boolean', example: false},
            max_allocation_wallet: {type: 'number', example: 0},
            min_allocation_wallet_limit: {type: 'boolean', example: false},
            min_allocation_wallet: {type: 'number', example: 0},
            access_type: {type: 'string', example:"public"},
            sale_start_time: {type: 'string', example:"2021-08-23T06:32:00.000Z"},
            sale_end_time: {type: 'string', example:"2021-08-25T06:32:00.000Z"},
            listing_rate: {type: 'number', example: 1.2},
            initial_liquidity_per: {type: 'number', example: 50},
            listing_time: {type: 'string', example:"2021-08-26T06:43:00.000Z"},
            lock_liquidity: {type: 'string', example:"ONE_MONTH"},
            est_funding: {type: 'number', example: 1000},
            distribution_type: {type: 'string', example:"SAME_AS_LISTING"},
            distribution_date: {type: 'string', example:"2021-08-26T06:43:00.000Z"},
            distribution_interval: {type: 'number', example: 1},
            distribution_interval_period: {type: 'number', example: 0},
            first_unlock_rate: {type: 'number', example: 100},
            unlock_rate: {type: 'number', example: 0},
            created_at: {type: 'string', example:"2021-08-20T06:44:38.000Z"},
            updated_at: {type: 'string', example:"2021-08-20T06:44:38.000Z"}
          }},
          presale: {type: 'object', properties: {
            presale_id: {type: 'number', example: 375},
            project_id: {type: 'number', example:411},
            total_tokens_sold: {type: 'number', example:0},
            total_base_collected: {type: 'number', example:0},
            number_buyers: {type: 'number', example:0},
            is_added_liquidity: {type: 'number', example:null},
            is_force_failed: {type: 'number', example:null},
            is_transferred_fee: {type: 'boolean', example:false},
            is_list_on_uniswap: {type: 'boolean', example:false},
            total_base_withdrawn: {type: 'number', example:0},
            total_tokens_withdrawn: {type: 'number', example:0},
            is_whitelist_only: {type: 'boolean', example:false},
            is_owner_withdrawn: {type: 'boolean', example:false},
            price: {type: 'number', example:0},
            is_success: {type: 'number', example:true},
            created_at: {type: 'string', example:"2021-09-08T04:11:46.000Z"},
            updated_at: {type: 'string', example:"2021-09-08T04:11:46.000Z"}
          }},
          follows: {type: 'array', items: {
            type: 'object', properties: {
              project_id: {type: 'number', example: 1},
              wallet_id: {type: 'number', example: 1}
            }
          }},
          understands: {type: 'array', items: {
            type: 'object', properties: {
              project_id: {type: 'number', example: 1},
              wallet_id: {type: 'number', example: 1}
            }
          }},
          project_pitches: {type: 'array', items: {
            type: 'object', properties: {
              project_pitch_id: {type: 'number', example: 500},
              project_id: {type: 'number', example:411},
              uploaded_video: {type: 'string', example:null},
              heading_title: {type: 'string', example:null},
              navigation_title: {type: 'string', example:"Problem and Solution"},
              content: {type: 'string', example:null},
              order: {type: 'number', example:5},
              display: {type: 'boolean', example:false},
              created_at: {type: 'string', example:"2021-08-20T06:44:38.000Z"},
              updated_at: {type: 'string', example:"2021-08-20T06:44:38.000Z"}
            }
          }},
          wallet: {
            type: 'object', properties: {
              network_id: {
                type: 'number', example: '1'
              }
            }
          },
          isClosed: {
            type: 'boolean', example: 'true'
          }
        }
      }}
    }},
    current_server_time: {type: 'string', example: "2021-09-01T11:20:38.457Z"},
  };

  const updateProjectInfoBody = {
    type: 'object',
    properties: {
      project_logo: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      project_image: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/hoi_an_cover_photo--1629278704401.jpg"},
      project_twitter: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      project_telegram: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      project_medium: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      project_discord: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      project_name: {type: 'string', example: "222222"},
      project_sub_title: {type: 'string', example: "123213213"},
      sale_round_launch: {type: 'string', example: "2nd round"},
      project_website: {type: 'string', example: "https://daolaunch.net/beta2/admin_setfaetured.html"},
      project_email: {type: 'email', example: "333@gmail.com"},
      project_white_paper: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/Screenshot from 2021-08-16 15-58-00--1629278695498.png"},
      whitelist: {type: 'array', items: {
        type: 'string', example: '0x0d8a7b783d1f29a7631fb09ebf25ff956c323ca4'
      }},
      whitelist_address_csv: {type: 'string', example: "https://dev-bintech.s3.amazonaws.com/hoi_an_cover_photo--1629278704401.jpg"}
    },
    required: [
      'project_name',
      'project_sub_title',
      'project_website',
      'project_email'
    ]
  }

  const updateProjectPitchBody = {
    type: 'array',
    items: {
      type: 'object',
      properties: { 
        project_pitch_id: {type: 'number', example: 1},
        navigation_title: {type: 'string', example:"https://dev-bintech.s3.amazonaws.com/hoi_an_cover_photo--1629278704401.jpg"},
        uploaded_video: {type: 'string', example:"https://dev-bintech.s3.amazonaws.com/hoi_an_cover_photo--1629278704401.jpg"},
        heading_title: {type: 'string', example:"bap"},
        content: {type: 'string', example:"bap"},
        order: {type: 'number', example:1},
        display: {type: 'boolean', example:true}
      }
    }
  }

  export { Response, updateProjectInfoBody, updateProjectPitchBody }